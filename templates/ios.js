module.exports = platform => [{
  name: ({ moduleName }) => `${moduleName}.podspec`,
  content: ({ moduleName, tvosEnabled, githubAccount, authorName, authorEmail, license, useAppleNetworking }) => `require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "${moduleName}"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  ${moduleName}
                   DESC
  s.homepage     = "https://github.com/${githubAccount}/${moduleName}"
  # brief license entry:
  s.license      = "${license}"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "${license}", :file => "LICENSE" }
  s.authors      = { "${authorName}" => "${authorEmail}" }
  s.platforms    = { :ios => "9.0"${tvosEnabled ? `, :tvos => "10.0"` : ``} }
  s.source       = { :git => "https://github.com/${githubAccount}/${moduleName}.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  ${useAppleNetworking ? `s.dependency 'AFNetworking', '~> 3.0'` : `# ...`}
  # s.dependency "..."
end

`,
}, {
  // header for module without view:
  name: ({ objectClassName, view }) => !view && `${platform}/${objectClassName}.h`,
  content: ({ objectClassName }) => `#import <React/RCTBridgeModule.h>

@interface ${objectClassName} : NSObject <RCTBridgeModule>

@end
`,
}, {
  // implementation of module without view:
  name: ({ objectClassName, view }) => !view && `${platform}/${objectClassName}.m`,
  content: ({ objectClassName, useAppleNetworking }) => `#import "${objectClassName}.h"

${useAppleNetworking ? `#import <AFNetworking/AFNetworking.h>
` : ``}
@implementation ${objectClassName}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(sampleMethod:(NSString *)stringArgument numberParameter:(nonnull NSNumber *)numberArgument callback:(RCTResponseSenderBlock)callback)
` +
    // sample method body with tabs for truthy useAppleNetworking *only*:
    (useAppleNetworking
      ? `{
	AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
	manager.responseSerializer.acceptableContentTypes = [NSSet setWithObject:@"text/plain"];
	[manager GET:@"https://httpstat.us/200" parameters:nil progress:nil success:^(NSURLSessionTask *task, id responseObject) {
			callback(@[[NSString stringWithFormat: @"numberArgument: %@ stringArgument: %@ resp: %@", numberArgument, stringArgument, responseObject]]);
	} failure:^(NSURLSessionTask *operation, NSError *error) {
			callback(@[[NSString stringWithFormat: @"numberArgument: %@ stringArgument: %@ err: %@", numberArgument, stringArgument, error]]);
	}];
}`
      : `{
    // TODO: Implement some actually useful functionality
    callback(@[[NSString stringWithFormat: @"numberArgument: %@ stringArgument: %@", numberArgument, stringArgument]]);
}`) + `

@end
`,
}, {
  // header for module with view:
  name: ({ objectClassName, view }) => view && `${platform}/${objectClassName}.h`,
  content: ({ objectClassName }) => `#import <React/RCTViewManager.h>

@interface ${objectClassName} : RCTViewManager

@end
`,
}, {
  // implementation of module with view:
  name: ({ objectClassName, view }) => view && `${platform}/${objectClassName}.m`,
  content: ({ objectClassName }) => `#import "${objectClassName}.h"

@implementation ${objectClassName}

RCT_EXPORT_MODULE()

- (UIView *)view
{
    // TODO: Implement some actually useful functionality
    UILabel * label = [[UILabel alloc] init];
    [label setTextColor:[UIColor redColor]];
    [label setText: @"*****"];
    [label sizeToFit];
    UIView * wrapper = [[UIView alloc] init];
    [wrapper addSubview:label];
    return wrapper;
}

@end
`,
}, {
  name: ({ objectClassName }) => `${platform}/${objectClassName}.xcworkspace/contents.xcworkspacedata`,
  content: ({ objectClassName }) => `<?xml version="1.0" encoding="UTF-8"?>
<Workspace
   version = "1.0">
   <FileRef
      location = "group:${objectClassName}.xcodeproj">
   </FileRef>
</Workspace>
`,
}, {
  name: ({ objectClassName }) => `${platform}/${objectClassName}.xcodeproj/project.pbxproj`,
  content: ({ objectClassName }) => `// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 46;
	objects = {

/* Begin PBXCopyFilesBuildPhase section */
		58B511D91A9E6C8500147676 /* CopyFiles */ = {
			isa = PBXCopyFilesBuildPhase;
			buildActionMask = 2147483647;
			dstPath = "include/$(PRODUCT_NAME)";
			dstSubfolderSpec = 16;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXCopyFilesBuildPhase section */

/* Begin PBXFileReference section */
		134814201AA4EA6300B7C361 /* lib${objectClassName}.a */ = {isa = PBXFileReference; explicitFileType = archive.ar; includeInIndex = 0; path = lib${objectClassName}.a; sourceTree = BUILT_PRODUCTS_DIR; };
/* End PBXFileReference section */

/* Begin PBXFrameworksBuildPhase section */
		58B511D81A9E6C8500147676 /* Frameworks */ = {
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXFrameworksBuildPhase section */

/* Begin PBXGroup section */
		134814211AA4EA7D00B7C361 /* Products */ = {
			isa = PBXGroup;
			children = (
				134814201AA4EA6300B7C361 /* lib${objectClassName}.a */,
			);
			name = Products;
			sourceTree = "<group>";
		};
		58B511D21A9E6C8500147676 = {
			isa = PBXGroup;
			children = (
				134814211AA4EA7D00B7C361 /* Products */,
			);
			sourceTree = "<group>";
		};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		58B511DA1A9E6C8500147676 /* ${objectClassName} */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 58B511EF1A9E6C8500147676 /* Build configuration list for PBXNativeTarget "${objectClassName}" */;
			buildPhases = (
				58B511D71A9E6C8500147676 /* Sources */,
				58B511D81A9E6C8500147676 /* Frameworks */,
				58B511D91A9E6C8500147676 /* CopyFiles */,
			);
			buildRules = (
			);
			dependencies = (
			);
			name = ${objectClassName};
			productName = RCTDataManager;
			productReference = 134814201AA4EA6300B7C361 /* lib${objectClassName}.a */;
			productType = "com.apple.product-type.library.static";
		};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		58B511D31A9E6C8500147676 /* Project object */ = {
			isa = PBXProject;
			attributes = {
				LastUpgradeCheck = 0920;
				ORGANIZATIONNAME = Facebook;
				TargetAttributes = {
					58B511DA1A9E6C8500147676 = {
						CreatedOnToolsVersion = 6.1.1;
					};
				};
			};
			buildConfigurationList = 58B511D61A9E6C8500147676 /* Build configuration list for PBXProject "${objectClassName}" */;
			compatibilityVersion = "Xcode 3.2";
			developmentRegion = English;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
			);
			mainGroup = 58B511D21A9E6C8500147676;
			productRefGroup = 58B511D21A9E6C8500147676;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				58B511DA1A9E6C8500147676 /* ${objectClassName} */,
			);
		};
/* End PBXProject section */

/* Begin PBXSourcesBuildPhase section */
		58B511D71A9E6C8500147676 /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXSourcesBuildPhase section */

/* Begin XCBuildConfiguration section */
		58B511ED1A9E6C8500147676 /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++0x";
				CLANG_CXX_LIBRARY = "libc++";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_TESTABILITY = YES;
				GCC_C_LANGUAGE_STANDARD = gnu99;
				GCC_DYNAMIC_NO_PIC = NO;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_OPTIMIZATION_LEVEL = 0;
				GCC_PREPROCESSOR_DEFINITIONS = (
					"DEBUG=1",
					"$(inherited)",
				);
				GCC_SYMBOLS_PRIVATE_EXTERN = NO;
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 9.0;
				LD_RUNPATH_SEARCH_PATHS = "/usr/lib/swift $(inherited)";
				LIBRARY_SEARCH_PATHS = (
					"\\"$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)\\"",
					"\\"$(TOOLCHAIN_DIR)/usr/lib/swift-5.0/$(PLATFORM_NAME)\\"",
					"\\"$(inherited)\\"",
				);
				MTL_ENABLE_DEBUG_INFO = YES;
				ONLY_ACTIVE_ARCH = YES;
				SDKROOT = iphoneos;
			};
			name = Debug;
		};
		58B511EE1A9E6C8500147676 /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++0x";
				CLANG_CXX_LIBRARY = "libc++";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = YES;
				ENABLE_NS_ASSERTIONS = NO;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				GCC_C_LANGUAGE_STANDARD = gnu99;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 9.0;
				LD_RUNPATH_SEARCH_PATHS = "/usr/lib/swift $(inherited)";
				LIBRARY_SEARCH_PATHS = (
					"\\"$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)\\"",
					"\\"$(TOOLCHAIN_DIR)/usr/lib/swift-5.0/$(PLATFORM_NAME)\\"",
					"\\"$(inherited)\\"",
				);
				MTL_ENABLE_DEBUG_INFO = NO;
				SDKROOT = iphoneos;
				VALIDATE_PRODUCT = YES;
			};
			name = Release;
		};
		58B511F01A9E6C8500147676 /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				HEADER_SEARCH_PATHS = (
					"$(inherited)",
					/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include,
					"$(SRCROOT)/../../../React/**",
					"$(SRCROOT)/../../react-native/React/**",
				);
				LIBRARY_SEARCH_PATHS = "$(inherited)";
				OTHER_LDFLAGS = "-ObjC";
				PRODUCT_NAME = ${objectClassName};
				SKIP_INSTALL = YES;
			};
			name = Debug;
		};
		58B511F11A9E6C8500147676 /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				HEADER_SEARCH_PATHS = (
					"$(inherited)",
					/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include,
					"$(SRCROOT)/../../../React/**",
					"$(SRCROOT)/../../react-native/React/**",
				);
				LIBRARY_SEARCH_PATHS = "$(inherited)";
				OTHER_LDFLAGS = "-ObjC";
				PRODUCT_NAME = ${objectClassName};
				SKIP_INSTALL = YES;
			};
			name = Release;
		};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		58B511D61A9E6C8500147676 /* Build configuration list for PBXProject "${objectClassName}" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				58B511ED1A9E6C8500147676 /* Debug */,
				58B511EE1A9E6C8500147676 /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		58B511EF1A9E6C8500147676 /* Build configuration list for PBXNativeTarget "${objectClassName}" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				58B511F01A9E6C8500147676 /* Debug */,
				58B511F11A9E6C8500147676 /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
/* End XCConfigurationList section */
	};
	rootObject = 58B511D31A9E6C8500147676 /* Project object */;
}
`,
}];
