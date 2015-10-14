var bsApiKey = 'AIzaSyDe7kE78IkH14GGI4Vw6tEk1Bd-EK44thQ';

// This is the scheme (http or https) to use for accessing the Telerik Backend Services REST API.
var bsScheme = 'http';

// This is your Google Cloud Console API project number. It is required by Google in order to enable push notifications for your Android. You do not need it for iOS.
var googleApiProjectNumber = '320758009053';

    // Initialize the Backend Services SDK
    var el = new Everlive({
        apiKey: bsApiKey,
        scheme: bsScheme
    });
        
    new kendo.mobile.Application(document.body, { transition: 'slide', skin: 'flat' });

    var mainViewModel = (function () {
        var successText = "SUCCESS!<br /><br />The device has been registered for push notifications.<br /><br />";
        
        var _onDeviceIsRegistered = function() {
            $("#registerButton").hide();
            $("#unregisterButton").show();
            $("#messageParagraph").html(successText);
        };
        
        var _onDeviceUnregistered = function() {
            $("#messageParagraph").html("Device successfully unregistered.");
            $("#registerButton").show();
            $("#unregisterButton").hide();
        };
        
        var onAndroidPushReceived = function(args) {
            alert('Android notification received: ' + JSON.stringify(args)); 
        };
        
        var onIosPushReceived = function(args) {
            alert('iOS notification received: ' + JSON.stringify(args)); 
        };
        
        var onWP8PushReceived = function (args) {
            alert('Windows Phone notification received: ' + JSON.stringify(args)); 
        };
        
        var registerForPush = function() {
            var pushSettings = {
                android: {
                    senderID: googleApiProjectNumber
                },
                iOS: {
                    badge: "true",
                    sound: "true",
                    alert: "true"
                },
                wp8: {
                    channelName:'EverlivePushChannel'
                },
                notificationCallbackAndroid : onAndroidPushReceived,
                notificationCallbackIOS: onIosPushReceived,
                notificationCallbackWP8: onWP8PushReceived,
                customParameters: {
                    Age: 21
                }
            };
            
            el.push.register(pushSettings)
                .then(
                    _onDeviceIsRegistered,
                    function(err) {
                        alert('REGISTER ERROR: ' + JSON.stringify(err));
                    }
                    );
        };
        
        var unregisterFromPush = function() {
            el.push.unregister()
                .then(
                    _onDeviceUnregistered,
                    function(err) {
                        alert('UNREGISTER ERROR: ' + JSON.stringify(err));
                    }
                    );
        };
        
        return {
            registerForPush: registerForPush,
            unregisterFromPush: unregisterFromPush
        };
    }
