package android.net.wifi;

/** Doublure minimale pour essayer le relais sur la JVM (voir relay-test/README). */
public class WifiManager {
    public MulticastLock createMulticastLock(String tag) {
        return new MulticastLock();
    }

    public class MulticastLock {
        private boolean held;

        public void setReferenceCounted(boolean b) {
        }

        public void acquire() {
            held = true;
        }

        public void release() {
            held = false;
        }

        public boolean isHeld() {
            return held;
        }
    }
}
