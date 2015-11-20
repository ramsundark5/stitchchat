package com.stitchchat.sqlite;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.sqlite.SQLiteStatement;

// import com.facebook.common.logging.FLog;
// import com.facebook.react.common.ReactConstants;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.concurrent.ConcurrentHashMap;

public class SQLiteManager extends SQLiteOpenHelper {
	private static final int DATABASE_VERSION = 1;
	private static ConcurrentHashMap<String,  SQLiteManager> dbMap = new ConcurrentHashMap<>();

	public static synchronized SQLiteManager initDB(ReactApplicationContext context, final String dbName) {

		// Use the application context, which will ensure that you
		// don't accidentally leak an Activity's context.
		// See this article for more information: http://bit.ly/6LRzfx
		if(dbMap.get(dbName) == null){
			final SQLiteManager newInstance = new SQLiteManager(context, dbName);
			dbMap.put(dbName, newInstance);
		}
		return dbMap.get(dbName);
	}

	private SQLiteManager(ReactApplicationContext context, final String dbName) {
		super(context, dbName, null, DATABASE_VERSION);
	}

	public static Boolean isOpen(final String dbName) {
		SQLiteDatabase db = getDatabaseForRead(dbName);
		return db.isOpen();
	}

	public static void closeAll(){
		for(String dbName : dbMap.keySet()){
			close(dbName);
			dbMap.remove(dbName);
		}
	}

	public static void close(final String dbName) {
		SQLiteDatabase db = getDatabaseForRead(dbName);
		if(db!=null && db.isOpen()){
			db.close();
		}
	}

	public static void executeUpdate(final String dbName, final String sql, final ReadableArray values) {
		SQLiteDatabase db = getDatabaseForWrite(dbName);
		SQLiteStatement statement = db.compileStatement(sql);

		db.beginTransaction();
		try {
			bindArgstoStatement(statement, values);
			statement.executeUpdateDelete();
			db.setTransactionSuccessful();
		} catch (Exception e) {
			throw e;
		} finally {
			db.endTransaction();
		}
	}

	public static long executeInsert(final String dbName, final String sql, final ReadableArray values) {
		SQLiteDatabase db = getDatabaseForWrite(dbName);
		SQLiteStatement statement = db.compileStatement(sql);
		long insertedRowId = -1;
		db.beginTransaction();
		try {
			bindArgstoStatement(statement, values);
			insertedRowId = statement.executeInsert();
			db.setTransactionSuccessful();
		} catch (Exception e) {
			throw e;
		} finally {
			db.endTransaction();
		}
		return insertedRowId;
	}

	public static WritableArray executeQuery(final String dbName, final String sql, final ReadableArray values) {
		WritableArray data = Arguments.createArray();
		// FLog.w(ReactConstants.TAG, "values.size()=%s", Integer.toString(values.size()));

		String[] args = new String[values.size()];
		// FLog.w(ReactConstants.TAG, "sqlitemanager.query.args.length=%d", args.length);

		for ( int i=0; i < values.size(); i++) {
			if (values.getType(i) == ReadableType.Number) {
				args[i] = String.valueOf(values.getDouble(i));
			} else if (values.isNull(i)) {
				args[i] = null;
			} else {
				args[i] = values.getString(i);
			}
		}
		SQLiteDatabase db = getDatabaseForRead(dbName);
		Cursor cursor = db.rawQuery(sql, args);

		try {
			if (cursor.moveToFirst()) {
				do {
					WritableMap item = Arguments.createMap();
					for (int i=0; i < cursor.getColumnCount(); i++) {
						switch( cursor.getType(i) ) {
							case Cursor.FIELD_TYPE_INTEGER:
								item.putDouble(cursor.getColumnName(i), cursor.getDouble(i));
								break;
							default:
								if(cursor.isNull(i)){
									item.putString(cursor.getColumnName(i), null);
								}else{
									item.putString(cursor.getColumnName(i), cursor.getString(i));
								}
								break;
						}
					}

					data.pushMap(item);
				} while (cursor.moveToNext());
			}
		} catch (Exception e) {
			throw e;
		} finally {
			cursor.close();
		}

		return data;
	}

	public static SQLiteDatabase getDatabaseForWrite(final String dbName){
		SQLiteManager sInstance = dbMap.get(dbName);
		if(sInstance == null){
			throw new RuntimeException("DB is not initialized "+dbName);
		}
		return sInstance.getWritableDatabase();
	}

	public static SQLiteDatabase getDatabaseForRead(final String dbName){
		SQLiteManager sInstance = dbMap.get(dbName);
		if(sInstance == null){
			throw new RuntimeException("DB is not initialized "+dbName);
		}
		return sInstance.getReadableDatabase();
	}

	private static void bindArgstoStatement(SQLiteStatement statement, ReadableArray values){
		for (int i=0; i < values.size(); i++) {
			if (values.getType(i) == ReadableType.Number) {
				statement.bindDouble(i+1, values.getDouble(i));
				//statement.bindString(i + 1, values.getString(i));
			} else if (values.isNull(i)) {
				statement.bindNull(i + 1);
			} else {
				statement.bindString(i+1, values.getString(i));
			}
		}
	}

	@Override
	public void onCreate(SQLiteDatabase db) {

	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

	}
}