// 方案 B: Web-only 版本 - postMessage 通訊支援
(function() {
    // 覆寫 Android 檢測為 false
    window.isAndroidWebView = false;
    window.isInIframe = window.self !== window.top;

    // postMessage 通訊：通知父視窗
    window.notifyParent = function(eventType, data) {
        if (window.isInIframe && window.parent) {
            window.parent.postMessage({
                source: 'interactive-map',
                type: eventType,
                data: data,
                timestamp: Date.now()
            }, '*');
            console.log('[postMessage] 已通知父視窗:', eventType, data);
        }
    };

    // 接收來自父視窗的訊息
    window.addEventListener('message', function(event) {
        // 安全檢查
        if (!event.data || event.data.source !== 'parent-window') return;

        console.log('[postMessage] 收到父視窗訊息:', event.data);

        switch(event.data.type) {
            case 'locateVendor':
                // 處理定位廠商請求
                if (typeof window.locateVendorFromAndroid === 'function') {
                    window.locateVendorFromAndroid(event.data.vendorName);
                }
                break;
            case 'config':
                // 處理配置更新
                console.log('收到配置:', event.data.data);
                break;
        }
    });

    console.log('[postMessage] iframe 通訊已初始化');
})();
