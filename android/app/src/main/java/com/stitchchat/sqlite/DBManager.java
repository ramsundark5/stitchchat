package com.stitchchat.sqlite;

import javax.annotation.Nullable;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.GuardedAsyncTask;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.common.ReactConstants;


public final class DBManager extends ReactContextBaseJavaModule {
	private @Nullable SQLiteManager mDb;
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
		if (mDb != null && mDb.isOpen()) {
			mDb.close();
			mDb = null;
		}
	}	

	@ReactMethod
	public void initDB(final String name, final Callback callback) {
		new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
			@Override
			protected void doInBackgroundGuarded(Void ...params) {
				FLog.w(ReactConstants.TAG, "dbmanager.init.name=%s", name);
				SQLiteManager.init(getReactApplicationContext(), name);//new SQLiteManager(getReactApplicationContext(), name);
				callback.invoke();
			}
		}.execute();
	}

	@ReactMethod
	public void executeQuery(final String sql, final ReadableArray values, final Callback callback) {
		new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
			@Override
			protected void doInBackgroundGuarded(Void ...params) {
				WritableArray data = Arguments.createArray();

				FLog.w(ReactConstants.TAG, "dbmanager.query.sql=%s", sql);
				FLog.w(ReactConstants.TAG, "dbmanager.query.values.size()=%d", values.size());

				try {
					data = mDb.query(sql, values);
				} catch(Exception e) {
					FLog.w(ReactConstants.TAG, "Exception in database query: ", e);
					callback.invoke(ErrorUtil.getError(null, e.getMessage()), null);
				}

				callback.invoke(null, data);
			}
		}.execute();
	}

	@ReactMethod
	public void executeInsert(final String sql, final ReadableArray values, final Callback callback) {
		new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
			@Override
			protected void doInBackgroundGuarded(Void ...params) {
				double lastInsertRowId = 0;
				try {
					mDb.exec(sql, values);
					String sql = "select last_insert_rowid()";
					//Arguments.createArray();
					WritableArray result = mDb.query(sql, Arguments.createArray());
					if(result != null && result.size() > 0){
						lastInsertRowId = result.getDouble(0);
					}
				} catch(Exception e) {
					FLog.w(ReactConstants.TAG, "Exception in database exec: ", e);
					callback.invoke(ErrorUtil.getError(null, e.getMessage()), null);
				}

				callback.invoke(null, lastInsertRowId);
			}
		}.execute();
	}

	@ReactMethod
	public void executeUpdate(final String sql, final ReadableArray values, final Callback callback) {
		new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
			@Override
			protected void doInBackgroundGuarded(Void ...params) {
				try {
					mDb.exec(sql, values);
				} catch(Exception e) {
					FLog.w(ReactConstants.TAG, "Exception in database exec: ", e);
					callback.invoke(ErrorUtil.getError(null, e.getMessage()), null);
				}

				callback.invoke();
			}
		}.execute();
	}

	@ReactMethod
	public void close(final Callback callback) {
		new GuardedAsyncTask<Void, Void>(getReactApplicationContext()) {
			@Override
			protected void doInBackgroundGuarded(Void ...params) {
				try {
					mDb.close();
				} catch(Exception e) {
					FLog.w(ReactConstants.TAG, "Exception in database close: ", e);
					callback.invoke(ErrorUtil.getError(null, e.getMessage()), null);
				}

				callback.invoke();
			}
		}.execute();
	}
}
