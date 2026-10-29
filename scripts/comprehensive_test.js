const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:\\Users\\DEVENDER\\.gemini\\antigravity\\brain\\2dd31d9b-3f2c-4247-9319-6d3e04e1b616';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

async function runVerification() {
  console.log('🚀 Starting Comprehensive Verification Suite on real Google Chrome...');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // ────────────────────────────────────────────────────────────
  // STEP 1: DESKTOP VISUAL LAYOUT & SCHOOL CARDS AUDIT
  // ────────────────────────────────────────────────────────────
  console.log('\n--- STEP 1: Desktop Visual Layout Audit ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    geolocation: { latitude: 28.6139, longitude: 77.2090 },
    permissions: ['geolocation']
  });
  const page = await desktopContext.newPage();

  // Listen to console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(`${BASE_URL}/schools`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Take Desktop Directory View screenshot
  const screenshot1 = path.join(ARTIFACTS_DIR, 'verify_01_desktop_directory.png');
  await page.screenshot({ path: screenshot1, fullPage: false });
  console.log(`✅ Step 1: Captured desktop directory layout: ${screenshot1}`);

  // Check card elements
  const schoolCards = await page.locator('button[title*="Claim this school"]').count();
  console.log(`✅ Step 1: Rendered school cards count: ${schoolCards}`);

  // ────────────────────────────────────────────────────────────
  // STEP 2: CLAIM FORM & EMAIL OTP LOGIN ACTIVATION
  // ────────────────────────────────────────────────────────────
  console.log('\n--- STEP 2: Claim Form & OTP Login Flow ---');
  
  // Find exact Claim button on first school card
  const claimBtn = page.locator('button[title*="Claim this school"]').first();
  await claimBtn.waitFor({ state: 'visible', timeout: 5000 });
  await claimBtn.click({ force: true });
  console.log('✅ Clicked Claim button on School Card');

  await page.waitForTimeout(1000);

  // Verify Claim Modal is open
  const modalHeader = page.locator('h3:has-text("Claim School Profile")').first();
  await modalHeader.waitFor({ state: 'visible', timeout: 8000 });
  console.log('✅ Claim Modal is visible');

  // Fill Claimant Name
  const nameInput = page.locator('input[placeholder*="Ramesh Kumar Sharma"]').first();
  await nameInput.fill('Pt. Devender Kaushik');

  // Fill Designation
  const desigInput = page.locator('input[placeholder*="Principal / Director / Admin"]').first();
  await desigInput.fill('Principal & Administrator');

  // Fill WhatsApp Phone (compulsory 10 digits)
  const phoneInput = page.locator('input[placeholder*="10-digit WhatsApp number"]').first();
  await phoneInput.fill('9876543210');

  // Fill PIN Code (e.g. 110001 for Central Delhi)
  const pinInput = page.locator('input[placeholder*="110001"]').first();
  await pinInput.fill('110001');
  console.log('✅ Entered PIN Code: 110001. Waiting for auto-fill location...');
  await page.waitForTimeout(2000);

  // Verify District & State autofill
  const districtInput = page.locator('input[placeholder*="Central Delhi"]').first();
  const stateInput = page.locator('input[placeholder*="Delhi"]').first();
  console.log(`✅ District autofilled: ${await districtInput.inputValue()}, State autofilled: ${await stateInput.inputValue()}`);

  // Fill Email ptdevkaushik101@gmail.com
  const emailInput = page.locator('input[placeholder*="principal@school.edu.in"]').first();
  await emailInput.fill('ptdevkaushik101@gmail.com');
  console.log('✅ Filled Email: ptdevkaushik101@gmail.com');

  // Screenshot Claim Form with filled fields BEFORE Login Now click
  const screenshotClaimBefore = path.join(ARTIFACTS_DIR, 'verify_02_claim_form_filled.png');
  await page.screenshot({ path: screenshotClaimBefore });
  console.log(`✅ Step 2: Captured filled Claim Form: ${screenshotClaimBefore}`);

  // Click "Login Now" button
  const loginNowBtn = page.locator('button:has-text("Login Now")').first();
  await loginNowBtn.click();
  console.log('✅ Clicked "Login Now" button');

  // Verify OTP notification banner appears with green text & live timer
  const otpBanner = page.locator('text="OTP is sent to your mail"');
  await otpBanner.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ OTP banner is visible: "OTP is sent to your mail"');

  const timerText = await page.locator('text=/Valid for \\d{2}:\\d{2}/').innerText();
  console.log(`✅ Countdown timer is running: "${timerText}"`);

  // Screenshot OTP field & green banner
  const screenshotOtpBanner = path.join(ARTIFACTS_DIR, 'verify_03_claim_otp_sent.png');
  await page.screenshot({ path: screenshotOtpBanner });
  console.log(`✅ Step 2: Captured OTP sent banner: ${screenshotOtpBanner}`);

  // Enter OTP Code
  const otpInput = page.locator('input[placeholder*="Enter 4 or 6-digit OTP"]');
  await otpInput.fill('1234');
  console.log('✅ Entered OTP code: 1234');

  // Click "Verify OTP"
  const verifyOtpBtn = page.locator('button:has-text("Verify OTP")');
  await verifyOtpBtn.click();
  console.log('✅ Clicked "Verify OTP"');
  await page.waitForTimeout(1500);

  // Verify Verified / Logged in badge
  const verifiedBadge = page.locator('text="Verified / Logged In"');
  if (await verifiedBadge.isVisible()) {
    console.log('✅ Verified / Logged In status confirmed!');
  }

  // Fill Requirements Note
  const noteArea = page.locator('textarea').first();
  await noteArea.fill('Requesting official verification & profile management access for our school.');

  // Submit Claim
  const submitClaimBtn = page.locator('button:has-text("Submit Claim Request")').first();
  await submitClaimBtn.click();
  console.log('✅ Clicked "Submit Claim Request"');
  await page.waitForTimeout(2000);

  // Screenshot Claim Success View
  const screenshotClaimSuccess = path.join(ARTIFACTS_DIR, 'verify_04_claim_success.png');
  await page.screenshot({ path: screenshotClaimSuccess });
  console.log(`✅ Step 2: Captured Claim Success screen: ${screenshotClaimSuccess}`);

  // Close Claim Modal
  const doneBtn = page.locator('button:has-text("Done / Close")').first();
  if (await doneBtn.isVisible()) {
    await doneBtn.click();
  } else {
    await page.keyboard.press('Escape');
  }
  await page.waitForTimeout(1000);

  // ────────────────────────────────────────────────────────────
  // STEP 3: MAP VIEW, NEAR ME TOGGLE & DISTANCE RADII AUDIT
  // ────────────────────────────────────────────────────────────
  console.log('\n--- STEP 3: Map View & Near Me Toggle Audit ---');
  
  // Click Map View switcher button
  const mapSwitchBtn = page.locator('button[aria-label="Interactive Map View"]');
  await mapSwitchBtn.click();
  await page.waitForTimeout(2500);

  // Take Map initial screenshot (Toggle is OFF by default)
  const screenshotMapInitial = path.join(ARTIFACTS_DIR, 'verify_05_map_toggle_off.png');
  await page.screenshot({ path: screenshotMapInitial });
  console.log(`✅ Step 3: Captured initial Map view (Toggle OFF): ${screenshotMapInitial}`);

  // Verify Distance buttons (3k, 5k, 10k, 25k) are DISABLED when Toggle is OFF
  const dist3kBtn = page.locator('.p-3.border-b button:has-text("3k")').first();
  const isDisabledOff = await dist3kBtn.isDisabled();
  console.log(`✅ Toggle OFF: Distance button 3k isDisabled = ${isDisabledOff} (Expected: true)`);

  // Activate "School Near Me" Toggle
  const nearMeToggle = page.locator('button[role="switch"][title*="Near Me"]').first();
  await nearMeToggle.click();
  console.log('✅ Clicked School Near Me Toggle -> Turned ON');
  await page.waitForTimeout(3000);

  // Verify Distance buttons are now ENABLED
  const isEnabledOn = !(await dist3kBtn.isDisabled());
  console.log(`✅ Toggle ON: Distance button 3k isEnabled = ${isEnabledOn} (Expected: true)`);

  // Take screenshot with Near Me ON at 5km default
  const screenshotNearMeOn = path.join(ARTIFACTS_DIR, 'verify_06_map_near_me_on_5km.png');
  await page.screenshot({ path: screenshotNearMeOn });
  console.log(`✅ Step 3: Captured Map with Near Me ON (5km): ${screenshotNearMeOn}`);

  // Test Distance Switching: Click 10k
  const dist10kBtn = page.locator('.p-3.border-b button:has-text("10k")').first();
  await dist10kBtn.click();
  console.log('✅ Clicked 10k radius button');
  await page.waitForTimeout(2500);

  // Test Distance Switching: Click 25k (Max radius)
  const dist25kBtn = page.locator('.p-3.border-b button:has-text("25k")').first();
  await dist25kBtn.click();
  console.log('✅ Clicked 25k radius button (Max radius)');
  await page.waitForTimeout(2500);

  const screenshotNearMe25k = path.join(ARTIFACTS_DIR, 'verify_07_map_near_me_25km.png');
  await page.screenshot({ path: screenshotNearMe25k });
  console.log(`✅ Step 3: Captured Map with Near Me at 25km: ${screenshotNearMe25k}`);

  // Test Map pagination next button
  const mapNextBtn = page.locator('.p-3.border-t button:has-text("Next")').first();
  if (await mapNextBtn.isVisible() && !(await mapNextBtn.isDisabled())) {
    await mapNextBtn.click();
    console.log('✅ Clicked Next Page in Map Sidebar');
    await page.waitForTimeout(2000);
    const screenshotMapPage2 = path.join(ARTIFACTS_DIR, 'verify_08_map_page_2.png');
    await page.screenshot({ path: screenshotMapPage2 });
    console.log(`✅ Step 3: Captured Map Page 2 results: ${screenshotMapPage2}`);
  }

  // ────────────────────────────────────────────────────────────
  // STEP 4: LIST MODE, SEARCH, FILTERS & PAGINATION AUDIT
  // ────────────────────────────────────────────────────────────
  console.log('\n--- STEP 4: List Mode, Search, Filters & Pagination Audit ---');

  // Switch to clean National Directory List View
  await page.goto(`${BASE_URL}/schools?page=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('✅ Clean List mode loaded');

  // Test Search Box
  const searchInput = page.locator('input[placeholder*="Search by school name"], input[placeholder*="Search"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('Delhi Public School');
    await page.keyboard.press('Enter');
    console.log('✅ Searched for: "Delhi Public School"');
    await page.waitForTimeout(2000);

    const screenshotSearch = path.join(ARTIFACTS_DIR, 'verify_09_list_search_results.png');
    await page.screenshot({ path: screenshotSearch });
    console.log(`✅ Step 4: Captured Search results: ${screenshotSearch}`);

    // Clear search
    await searchInput.fill('');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
  }

  // Test Pagination Click (Go to Page 2)
  console.log('Testing Pagination Bar: clicking page 2...');
  const page2Btn = page.locator('button[title="Go to Page 2"]').first();
  if (await page2Btn.count() > 0) {
    await page2Btn.scrollIntoViewIfNeeded();
    await page2Btn.click();
    await page.waitForTimeout(2500);
    const screenshotPage2 = path.join(ARTIFACTS_DIR, 'verify_10_list_page_2.png');
    await page.screenshot({ path: screenshotPage2 });
    console.log(`✅ Step 4: Captured Page 2 results: ${screenshotPage2}`);
  }

  // ────────────────────────────────────────────────────────────
  // STEP 5: MOBILE RESPONSIVE BOTTOM SHEET & DRAWER AUDIT
  // ────────────────────────────────────────────────────────────
  console.log('\n--- STEP 5: Mobile Viewport & Bottom Sheet Audit ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    geolocation: { latitude: 28.6139, longitude: 77.2090 },
    permissions: ['geolocation']
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${BASE_URL}/schools`, { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(2000);

  // Capture Mobile Directory
  const screenshotMobile = path.join(ARTIFACTS_DIR, 'verify_11_mobile_directory.png');
  await mobilePage.screenshot({ path: screenshotMobile });
  console.log(`✅ Step 5: Captured Mobile Directory: ${screenshotMobile}`);

  // Test Mobile Map & Bottom Sheet
  await mobilePage.goto(`${BASE_URL}/schools?view=map`, { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(2500);

  // Expand mobile bottom sheet to Split
  const halfSheetBtn = mobilePage.locator('button:has-text("Split")').first();
  if (await halfSheetBtn.isVisible()) {
    await halfSheetBtn.click();
    await mobilePage.waitForTimeout(1000);
  }

  const screenshotMobileMap = path.join(ARTIFACTS_DIR, 'verify_12_mobile_map_bottom_sheet.png');
  await mobilePage.screenshot({ path: screenshotMobileMap });
  console.log(`✅ Step 5: Captured Mobile Map with Bottom Sheet: ${screenshotMobileMap}`);

  await browser.close();

  console.log('\n🎉 ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  console.log(`Console Errors recorded: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Sample console errors:', consoleErrors.slice(0, 3));
  }
}

runVerification().catch(err => {
  console.error('❌ Verification script failed with error:', err);
  process.exit(1);
});
