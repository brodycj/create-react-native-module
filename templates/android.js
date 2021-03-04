module.exports = platform => [{
  name: () => `${platform}/build.gradle`,
  content: () => `// ${platform}/build.gradle

def rootExtGet(prop) {
    rootProject.ext.get(prop)
}

apply plugin: 'com.android.library'
apply plugin: 'maven'

android {
    compileSdkVersion rootExtGet('compileSdkVersion')
    buildToolsVersion rootExtGet('buildToolsVersion')
    defaultConfig {
        minSdkVersion rootExtGet('minSdkVersion')
        targetSdkVersion rootExtGet('targetSdkVersion')
        versionCode 1
        versionName "1.0"
    }
    lintOptions {
        abortOnError false
    }
}

repositories {
    // ref: https://www.baeldung.com/maven-local-repository
    mavenLocal()
    maven {
        // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
        url "$rootDir/../node_modules/react-native/android"
    }
    maven {
        // Android JSC is installed from npm
        url "$rootDir/../node_modules/jsc-android/dist"
    }
    google()
}

dependencies {
    //noinspection GradleDynamicVersion
    implementation 'com.facebook.react:react-native:+'  // From node_modules
}
`,
}, {
  name: () => `${platform}/src/main/AndroidManifest.xml`,
  content: ({ packageIdentifier }) => `<!-- AndroidManifest.xml -->

<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="${packageIdentifier}">

</manifest>
`,
}, {
  // for module without view:
  name: ({ objectClassName, packageIdentifier, view }) =>
    !view &&
      `${platform}/src/main/java/${packageIdentifier.split('.').join('/')}/${objectClassName}Module.java`,
  content: ({ objectClassName, packageIdentifier, view }) =>
    !view &&
      `// ${objectClassName}Module.java

package ${packageIdentifier};

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class ${objectClassName}Module extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public ${objectClassName}Module(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "${objectClassName}";
    }

    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        // TODO: Implement some actually useful functionality
        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
    }
}
`,
}, {
  // manager for view:
  name: ({ objectClassName, packageIdentifier, view }) =>
    view &&
      `${platform}/src/main/java/${packageIdentifier.split('.').join('/')}/${objectClassName}Manager.java`,
  content: ({ objectClassName, packageIdentifier, view }) =>
    view &&
      `// ${objectClassName}Manager.java

package ${packageIdentifier};

import android.view.View;

import androidx.appcompat.widget.AppCompatCheckBox;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class ${objectClassName}Manager extends SimpleViewManager<View> {

    public static final String REACT_CLASS = "${objectClassName}";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public View createViewInstance(ThemedReactContext c) {
        // TODO: Implement some actually useful functionality
        AppCompatCheckBox cb = new AppCompatCheckBox(c);
        cb.setChecked(true);
        return cb;
    }
}
`,
}, {
  // package for module without view:
  name: ({ objectClassName, packageIdentifier, view }) =>
    !view &&
      `${platform}/src/main/java/${packageIdentifier.split('.').join('/')}/${objectClassName}Package.java`,
  content: ({ objectClassName, packageIdentifier, view }) =>
    !view &&
      `// ${objectClassName}Package.java

package ${packageIdentifier};

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

public class ${objectClassName}Package implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(new ${objectClassName}Module(reactContext));
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
`,
}, {
  // package for manager for view:
  name: ({ objectClassName, packageIdentifier, view }) =>
    view &&
      `${platform}/src/main/java/${packageIdentifier.split('.').join('/')}/${objectClassName}Package.java`,
  content: ({ objectClassName, packageIdentifier, view }) =>
    view &&
      `// ${objectClassName}Package.java

package ${packageIdentifier};

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

public class ${objectClassName}Package implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new ${objectClassName}Manager());
    }
}
`,
}];
