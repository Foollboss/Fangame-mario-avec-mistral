package android.content;

/** Doublure minimale pour essayer le relais sur la JVM (voir relay-test/README). */
public abstract class Context {
    public static final String WIFI_SERVICE = "wifi";

    public Context getApplicationContext() {
        return this;
    }

    public Object getSystemService(String name) {
        return null;
    }
}
