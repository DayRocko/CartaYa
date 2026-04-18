const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        let errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
                console.log('BROWSER CONSOLE ERROR:', msg.text());
            }
        });
        page.on('pageerror', err => {
            errors.push(err.toString());
            console.log('BROWSER PAGE ERROR:', err.toString());
        });

        console.log('Navigating to page...');
        await page.goto('http://localhost:8001/Avance2135.html', { waitUntil: 'networkidle0', timeout: 15000 });
        
        console.log('Page loaded. Captured errors:', errors.length);
        if (errors.length === 0) {
            console.log('No errors captured. Taking screenshot to check if page rendered.');
            await page.screenshot({ path: 'puppeteer_screenshot.png' });
            
            // Check if our custom error div from the nuclear mount exists
            const customError = await page.evaluate(() => {
                const root = document.getElementById('root');
                return root ? root.innerHTML.substring(0, 100) : 'No root';
            });
            console.log('Root HTML preview:', customError);
        }
        
        await browser.close();
    } catch(err) {
        console.error('Puppeteer Script Error:', err);
    }
})();
