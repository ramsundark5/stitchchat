package com.stitchchat.sqlite;

import android.database.sqlite.SQLiteDatabase;

import javax.annotation.Nullable;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.GuardedAsyncTask;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.common.ReactConstants;


public final class DBManager extends ReactContextBaseJavaModule {
	private boolean mShuttingDown = false;

	public DBManager(ReactApplicationContext reactContext) {
		super(reactContext);
	}

	@Override
	public String getName() {
		return "DBManager";
	}

	@Override
	public void initialize() {
		super.initialize();
		mShuttingDown = false;
	}

	@Override
	public void onCatalystInstanceDestroy() {
		mShuttingDown = true;
		SQLiteManager.closeAll();
	}

	@ReactMethod
	public void initDB(final String dbName, final Callback callback) {
		new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
			@Override
			protected void doInBackgroundGuarded(Void ...params) {
				FLog.w(ReactConstants.TAG, "dbmanager.init.name=%s", dbName);
				SQLiteManager.initDB(getReactApplicationContext(), dbName);
				callback.invoke();
			}
		}.execute();
	}

	@ReactMethod
	public void executeQuery(final String dbName, final String sql, final ReadableArray values, final Callback callback) {
		new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
			@Override
			protected void doInBackgroundGuarded(Void ...params) {
				WritableArray data = Arguments.createArray();

				FLog.w(ReactConstants.TAG, "dbmanager.query.sql=%s", sql);
				FLog.w(ReactConstants.TAG, "dbmanager.query.values.size()=%d", values.size());

				try {
					data = SQLiteManager.executeQuery(dbName, sql, values);
				} catch(Exception e) {
					FLog.w(ReactConstants.TAG, "Exception in database query: ", e);
					callback.invoke(ErrorUtil.getError(null, e.getMessage()), null);
				}

				callback.invoke(null, data);
			}
		}.execute();
	}

	@ReactMethod
	public void executeInsert(final String dbName, final String sql, final ReadableArray values, final Callback callback) {
		new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
			@Override
			protected void doInBackgroundGuarded(Void ...params) {
				long lastInsertRowId = 0;
				try {
					lastInsertRowId = SQLiteManager.executeInsert(dbName, sql, values);
				} catch(Exception e) {
					FLog.w(ReactConstants.TAG, "Exception in database exec: ", e);
					callback.invoke(ErrorUtil.getError(null, e.getMessage()), null);
				}
				callback.invoke(null, String.valueOf(lastInsertRowId));
			}
		}.execute();
	}

	@ReactMethod
	public void executeUpdate(final String dbName, final String sql, final ReadableArray values, final Callback callback) {
		new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
			@Override
			protected void doInBackgroundGuarded(Void ...params) {
				try {
					SQLiteManager.executeUpdate(dbName, sql, values);
				} catch(Exception e) {
					FLog.w(ReactConstants.TAG, "Exception in database exec: ", e);
					callback.invoke(ErrorUtil.getError(null, e.getMessage()), null);
				}

				callback.invoke();
			}
		}.execute();
	}

	@ReactMethod
	public void close(final String dbName, final Callback callback) {
		new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
			@Override
			protected void doInBackgroundGuarded(Void ...params) {
				try {
					SQLiteManager.close(dbName);
				} catch(Exception e) {
					FLog.w(ReactConstants.TAG, "Exception in database close: ", e);
					callback.invoke(ErrorUtil.getError(null, e.getMessage()), null);
				}

				callback.invoke();
			}
		}.execute();
	}
}
