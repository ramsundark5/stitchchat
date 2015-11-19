package com.stitchchat.sqlite;

import javax.annotation.Nullable;

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

public class SQLiteManager extends SQLiteOpenHelper {
	static final int DATABASE_VERSION = 1;
	private static @Nullable SQLiteDatabase db;
	private static SQLiteManager sInstance;

	public static synchronized SQLiteManager init(ReactApplicationContext context, final String dbName) {

		// Use the application context, which will ensure that you
		// don't accidentally leak an Activity's context.
		// See this article for more information: http://bit.ly/6LRzfx
		if (sInstance == null) {
			sInstance = new SQLiteManager(context, dbName);
		}
		db = sInstance.getWritableDatabase();
		return sInstance;
	}

	public SQLiteManager(ReactApplicationContext context, String dbName) {
		super(context, dbName, null, DATABASE_VERSION);
	}

	public Boolean isOpen() {
		return db.isOpen();
	}

	public void close() {
		db.close();
	}

	public void exec(final String sql, final ReadableArray values) {
		SQLiteStatement statement = db.compileStatement(sql);

		db.beginTransaction();
		try {
			for (int i=0; i < values.size(); i++) {
				if (values.getType(i) == ReadableType.Number) {
					statement.bindLong(i+1, values.getInt(i));
				} else {
					statement.bindString(i+1, values.getString(i));
				}
			}

			statement.execute();
			db.setTransactionSuccessful();
		} catch (Exception e) {
			throw e;
		} finally {
			db.endTransaction();
		}
	}

	public WritableArray query(final String sql, final ReadableArray values) {
		WritableArray data = Arguments.createArray();
		// FLog.w(ReactConstants.TAG, "values.size()=%s", Integer.toString(values.size()));

		String[] args = new String[values.size()];
		// FLog.w(ReactConstants.TAG, "sqlitemanager.query.args.length=%d", args.length);

		for ( int i=0; i < values.size(); i++) {
			if (values.getType(i) == ReadableType.Number) {
				args[i] = Integer.toString(values.getInt(i));
			} else {
				args[i] = values.getString(i);
			}
		}

		Cursor cursor = db.rawQuery(sql, args);

		try {
			if (cursor.moveToFirst()) {
				do {
					WritableMap item = Arguments.createMap();
					for (int i=0; i < cursor.getColumnCount(); i++) {
						switch( cursor.getType(i) ) {
							case Cursor.FIELD_TYPE_INTEGER:
								item.putInt(cursor.getColumnName(i), cursor.getInt(i));
								break;
							default:
								item.putString(cursor.getColumnName(i), cursor.getString(i));
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

	@Override
	public void onCreate(SQLiteDatabase db) {

	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

	}
}