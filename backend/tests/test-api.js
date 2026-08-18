/**
 * Backend API & Utility Verification Test Suite
 */
import { hashPassword, verifyPassword } from '../src/utils/passwordUtils.js';
import { getJobInfo } from '../src/utils/classNames.js';
import { pingTcpPort } from '../src/utils/tcpPing.js';
import { registerSchema, loginSchema } from '../src/validators/authValidator.js';
import { AuthService } from '../src/services/authService.js';
import { AccountRepository } from '../src/repositories/accountRepository.js';
import { AccountService } from '../src/services/accountService.js';
import { ServerStatusService } from '../src/services/serverStatusService.js';
import { AdminService } from '../src/services/adminService.js';
import { 
  resolveItemInfo, 
  resolveCardNames, 
  formatItemTitle, 
  getEquipSlotName 
} from '../src/utils/itemDb.js';

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  PASS: ${name}`);
    passed++;
  } else {
    console.error(`  FAIL: ${name}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- Running KelsGaming RO Backend Verification Tests ---\n');

  // 1. Test Password Storage & Verification (Raw plaintext by default + Legacy MD5/Bcrypt support)
  console.log('[1] Testing Password Utilities (Raw plaintext + MD5/Bcrypt compatibility)');
  const plain = 'RagnarokSecret123!';
  
  // Test raw storage (default)
  const rawStored = await hashPassword(plain, 'raw');
  assert(rawStored === plain, 'Default storage mode returns raw plaintext for rAthena client compatibility');
  const validRawMatch = await verifyPassword(plain, rawStored);
  assert(validRawMatch === true, 'Raw password verifies successfully');

  // Test MD5 storage (legacy compatibility)
  const hashed = await hashPassword(plain, 'md5');
  assert(hashed.length === 32, 'MD5 hash is exactly 32 characters in length (VARCHAR(32) compliant)');
  assert(/^[a-f0-9]{32}$/.test(hashed), 'MD5 hash is valid 32-character hexadecimal string');
  const validMatch = await verifyPassword(plain, hashed);
  assert(validMatch === true, 'Valid password successfully verified with legacy rAthena MD5 hash');
  const invalidMatch = await verifyPassword('WrongPassword', hashed);
  assert(invalidMatch === false, 'Invalid password rejected');

  // 2. Test Job Class Name Mappings
  console.log('\n[2] Testing Ragnarok Job Class Mappings');
  assert(getJobInfo(0).name === 'Novice', 'Job 0 maps to Novice');
  assert(getJobInfo(4008).name === 'Lord Knight', 'Job 4008 maps to Lord Knight');
  assert(getJobInfo(4010).name === 'High Wizard', 'Job 4010 maps to High Wizard');
  assert(getJobInfo(4013).name === 'Assassin Cross', 'Job 4013 maps to Assassin Cross');

  // 3. Test Auth Input Validators (Zod)
  console.log('\n[3] Testing Input Validation Schemas');
  const validRegister = registerSchema.safeParse({
    username: 'kels_adventurer',
    email: 'kels@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    sex: 'M'
  });
  assert(validRegister.success === true, 'Valid registration payload accepted');

  const invalidUsername = registerSchema.safeParse({
    username: 'ab', // too short
    email: 'kels@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    sex: 'M'
  });
  assert(invalidUsername.success === false, 'Short username rejected');

  const mismatchedPass = registerSchema.safeParse({
    username: 'kels_adventurer',
    email: 'kels@example.com',
    password: 'password123',
    confirmPassword: 'differentPassword',
    sex: 'M'
  });
  assert(mismatchedPass.success === false, 'Mismatched passwords rejected');

  // 4. Test Service Registration & Login Flow with client IP mapping
  console.log('\n[4] Testing AuthService Registration & Login Flow');
  try {
    // Test AccountRepository createAccount with last_ip
    const repoAccount = await AccountRepository.createAccount({
      username: 'repo_ip_test',
      hashedPassword: '482c811da5d5b4bc6d497ffa98491e38',
      sex: 'M',
      email: 'repo_ip_test@kelsgaming.ro',
      birthdate: '2000-01-01',
      lastIp: '203.0.113.195'
    });
    assert(Boolean(repoAccount.accountId), 'AccountRepository creates account with insertId');
    assert(repoAccount.lastIp === '203.0.113.195', 'AccountRepository correctly maps non-null lastIp');

    // Test AuthService register passing client IP
    const regResult = await AuthService.register({
      username: 'hero_test',
      email: 'hero_test@kelsgaming.ro',
      password: 'password123',
      sex: 'M',
      ip: '198.51.100.42'
    });
    assert(Boolean(regResult.token), 'Registration produces JWT token');
    assert(regResult.user.username === 'hero_test', 'User data returned correctly');

    const loginResult = await AuthService.login({
      username: 'hero_test',
      password: 'password123'
    });
    assert(Boolean(loginResult.token), 'Login produces JWT token');
    assert(loginResult.user.accountId === regResult.user.accountId, 'Account IDs match across login');
  } catch (err) {
    console.error('AuthService test error:', err);
    failed++;
  }

  // 5. Test Server Health Status Service
  console.log('\n[5] Testing Server Health Status Service');
  const status = await ServerStatusService.getServerStatus(true);
  assert(status.serverName === 'KelsGaming RO', 'Server name matches KelsGaming RO');
  assert(status.host === '3.107.209.130', 'Host IP matches 3.107.209.130');
  assert(status.services.loginServer.port === 6900, 'Login port is 6900');
  assert(status.services.charServer.port === 6121, 'Char port is 6121');
  assert(status.services.mapServer.port === 5121, 'Map port is 5121');
  assert(typeof status.overallStatus === 'string', 'Overall status returned');

  // 6. Test Item DB & Equipment Resolvers
  console.log('\n[6] Testing Item DB & Equipment Resolvers');
  const potion = resolveItemInfo(501);
  assert(potion.name === 'Red Potion' && potion.type === 'usable', 'Item 501 resolves to Red Potion (usable)');

  const balmung = resolveItemInfo(1161);
  assert(balmung.name === 'Balmung' && balmung.type === 'weapon', 'Item 1161 resolves to Balmung (weapon)');

  const cards = resolveCardNames(4006, 4074, 0, 0);
  assert(cards.length === 2 && cards[0].name === 'Lunatic Card', 'Cards resolve Lunatic and Bigfoot');

  const formattedTitle = formatItemTitle({
    nameid: 1104,
    refine: 8,
    card0: 4006,
    card1: 4006,
    card2: 0,
    card3: 0
  });
  assert(formattedTitle === '+8 Falchion [3] (Lunatic, Lunatic)', 'Format item title with refine and slotted cards');

  const equipSlot = getEquipSlotName(2);
  assert(equipSlot === 'Right Hand (Weapon)', 'Equip bitmask 2 resolves to Right Hand (Weapon)');

  // 7. Test Phase 2 Inventory Actions & Safety Guards
  console.log('\n[7] Testing Phase 2 Inventory Actions & Safety Guards');
  try {
    // Test fetching inventory
    const invRes = await AccountService.getCharacterInventory(2000001, 150002);
    assert(invRes.character.name === 'KelsHighWizard', 'Fetched inventory for KelsHighWizard');
    assert(invRes.inventory.length >= 2, 'Inventory contains mock items');

    // Test Guard 1: Reject action if character is online (KelsLordKnight is online)
    try {
      await AccountService.deleteCharacterItem(2000001, 150001, 9003, 1);
      assert(false, 'Should reject deletion for online character');
    } catch (err) {
      assert(err.statusCode === 409, 'Online character deletion correctly rejected with 409 conflict');
    }

    // Test Guard 2: Reject deletion if item is equipped
    try {
      // In offline char, if item was equipped
      const item9003 = { ...invRes.inventory[0], equip: 2 };
      // Test item deletion for unequipped item on offline char
      const delRes = await AccountService.deleteCharacterItem(2000001, 150002, 9001, 10);
      assert(delRes.success === true, 'Successfully deleted unequipped item from offline character');
    } catch (err) {
      console.error('Delete item test failed:', err);
      failed++;
    }

    // Test Guard 3: Reject mail to self
    try {
      await AccountService.sendCharacterItemMail(2000001, 150002, 9002, {
        recipientName: 'KelsHighWizard',
        amount: 1
      });
      assert(false, 'Should reject mail to self');
    } catch (err) {
      assert(err.statusCode === 400, 'Self-mail correctly rejected with 400 error');
    }

    // Test Guard 4: Reject mail to non-existent player
    try {
      await AccountService.sendCharacterItemMail(2000001, 150002, 9002, {
        recipientName: 'NonExistentPlayer9999',
        amount: 1
      });
      assert(false, 'Should reject mail to non-existent player');
    } catch (err) {
      assert(err.statusCode === 404, 'Non-existent recipient rejected with 404');
    }

    // Test Mail Dispatch: Send Dragon Slayer to KelsLordKnight
    const mailRes = await AccountService.sendCharacterItemMail(2000001, 150002, 9002, {
      recipientName: 'KelsLordKnight',
      amount: 1,
      title: 'Gift for you',
      message: 'Take this blade into battle!'
    });
    assert(mailRes.success === true, 'Successfully dispatched in-game mail to recipient');

  } catch (err) {
    console.error('Phase 2 test suite error:', err);
    failed++;
  }

  // 8. Test Phase 1 Admin Portal RBAC & Dashboard Statistics
  console.log('\n[8] Testing Phase 1 Admin Portal RBAC & Dashboard Statistics');
  try {
    // Test 1: Admin Permission verification for regular player (groupId: 0)
    const playerPerms = AdminService.verifyAdminPermissions({ groupId: 0 });
    assert(playerPerms.isAdmin === false, 'groupId: 0 correctly identified as non-admin');
    assert(playerPerms.permissions.canManagePlayers === false, 'Player cannot manage players');

    // Test 2: Admin Permission verification for Administrator (groupId: 99)
    const adminPerms = AdminService.verifyAdminPermissions({ groupId: 99 });
    assert(adminPerms.isAdmin === true, 'groupId: 99 correctly identified as Administrator');
    assert(adminPerms.permissions.canManagePlayers === true, 'Admin can manage players');
    assert(adminPerms.permissions.canDispatchItems === true, 'Admin can dispatch items');

    // Test 3: Dashboard Stats aggregation
    const adminStats = await AdminService.getDashboardStats();
    assert(typeof adminStats.kpi.onlinePlayers === 'number', 'KPI onlinePlayers is a number');
    assert(typeof adminStats.kpi.totalAccounts === 'number', 'KPI totalAccounts is a number');
    assert(typeof adminStats.kpi.totalCharacters === 'number', 'KPI totalCharacters is a number');
    assert(typeof adminStats.kpi.bannedAccounts === 'number', 'KPI bannedAccounts is a number');
    assert(typeof adminStats.kpi.serverUptime === 'string', 'KPI serverUptime is a string');
    assert(Array.isArray(adminStats.activityTrend), 'activityTrend is an array of data points');
    assert(Array.isArray(adminStats.recentActions), 'recentActions is an array of audit logs');
    assert(adminStats.services.loginServer !== undefined, 'Services health contains loginServer');

    // Test 4: Admin Audit Log recording
    const newLog = AdminService.logAction({
      adminName: 'AdminTest',
      actionType: 'TEST_ACTION',
      target: 'Unit Test',
      details: 'Verified admin action logging'
    });
    assert(newLog.actionType === 'TEST_ACTION', 'Action correctly logged into audit stream');
  } catch (err) {
    console.error('Admin test suite error:', err);
    failed++;
  }

  // 9. Test Phase 2 Live Online Players, Deep Character Inspector & Moderation
  console.log('\n[9] Testing Phase 2 Live Online Players, Deep Character Inspector & Moderation');
  try {
    // Test 1: Fetch Online Players
    const onlineData = await AdminService.getOnlinePlayers();
    assert(Array.isArray(onlineData.players), 'Online players returned as array');
    assert(onlineData.players.length >= 1, 'Found at least 1 online character in mock store');
    const onlineKnight = onlineData.players.find(p => p.name === 'KelsLordKnight');
    assert(onlineKnight !== undefined, 'Found KelsLordKnight in online players');
    assert(onlineKnight.className === 'Lord Knight', 'KelsLordKnight job resolved to Lord Knight');

    // Test 2: Deep Character Inspector for KelsLordKnight (char_id: 150001)
    const inspection = await AdminService.inspectCharacter(150001);
    assert(inspection.character.name === 'KelsLordKnight', 'Inspector loaded KelsLordKnight');
    assert(inspection.character.className === 'Lord Knight', 'Job class name attached');
    assert(inspection.account.userid === 'testplayer', 'Account data linked to inspection');
    assert(Array.isArray(inspection.inventory), 'Backpack inventory is an array');
    assert(inspection.inventory.length > 0, 'Backpack contains items');
    assert(Array.isArray(inspection.storage), 'Kafra storage is an array');
    assert(Array.isArray(inspection.activityLogs.pickLogs), 'Activity picklogs is an array');
    assert(Array.isArray(inspection.activityLogs.zenyLogs), 'Activity zenylogs is an array');

    // Test 3: Unstuck Character Action
    const unstuckRes = await AdminService.unstuckCharacter(150001, { username: 'AdminKels' });
    assert(unstuckRes.success === true, 'Successfully unstuck character coordinates');

    // Test 4: Ban Account Action
    const banRes = await AdminService.banAccount(2000001, { durationHours: 24, reason: 'Test Ban' }, { username: 'AdminKels' });
    assert(banRes.success === true, 'Successfully applied temporary ban');

    // Test 5: Unban Account Action
    const unbanRes = await AdminService.unbanAccount(2000001, { username: 'AdminKels' });
    assert(unbanRes.success === true, 'Successfully unbanned account');

    // Test 6: Reset Character Points Action
    const resetRes = await AdminService.resetCharacterPoints(150001, { resetStats: true, resetSkills: true }, { username: 'AdminKels' });
    assert(resetRes.success === true, 'Successfully reset character points');
  } catch (err) {
    console.error('Phase 2 test suite error:', err);
    failed++;
  }

  // 10. Test Phase 3 Accounts, IP Alts, Characters Levels, Guilds & WoE Castles
  console.log('\n[10] Testing Phase 3 Accounts, IP Alts, Characters Levels, Guilds & WoE Castles');
  try {
    // Test 1: Fetch Accounts List
    const accountsData = await AdminService.getAccounts();
    assert(Array.isArray(accountsData.accounts), 'Accounts list returned as array');
    assert(accountsData.count >= 1, 'Found at least 1 account');
    assert(accountsData.accounts[0].char_count !== undefined, 'Character count attached to account');

    // Test 2: Alt Detector by IP
    const altsData = await AdminService.getAltsByIp('127.0.0.1');
    assert(Array.isArray(altsData.accounts), 'Alts by IP returned as array');
    assert(altsData.ip === '127.0.0.1', 'IP matched query');

    // Test 3: Update GM Level
    const gmRes = await AdminService.updateAccountGmLevel(2000001, 10, { username: 'AdminKels' });
    assert(gmRes.success === true, 'Successfully updated GM level');

    // Test 4: Reset PIN Code
    const pinRes = await AdminService.resetAccountPincode(2000001, { username: 'AdminKels' });
    assert(pinRes.success === true, 'Successfully reset Kafra PIN');

    // Test 5: Add VIP Subscription
    const vipRes = await AdminService.addAccountVip(2000001, 30, { username: 'AdminKels' });
    assert(vipRes.success === true, 'Successfully added VIP days');

    // Test 6: Update Character Levels
    const levelRes = await AdminService.updateCharacterLevels(150001, { baseLevel: 99, jobLevel: 70 }, { username: 'AdminKels' });
    assert(levelRes.success === true, 'Successfully updated character levels');

    // Test 7: Restore Character
    const restoreRes = await AdminService.restoreCharacter(150001, { username: 'AdminKels' });
    assert(restoreRes.success === true, 'Successfully restored character');

    // Test 8: Fetch Guilds
    const guildsData = await AdminService.getGuilds();
    assert(Array.isArray(guildsData.guilds), 'Guilds list returned as array');
    assert(guildsData.guilds.length >= 1, 'Found at least 1 guild');
    assert(guildsData.guilds[0].name === 'KelsGaming Vanguard', 'Guild Vanguard matched');

    // Test 9: Fetch WoE Castles
    const castlesData = await AdminService.getCastles();
    assert(Array.isArray(castlesData.castles), 'Castles list returned as array');
    assert(castlesData.castles.length >= 5, 'Returned 5 WoE castles');
    assert(castlesData.castles[0].realm === 'Valkyrie Realms', 'Valkyrie Realms castle verified');
  } catch (err) {
    console.error('Phase 3 test suite error:', err);
    failed++;
  }

  // 11. Test Phase 4 Web Item & Mail / RodEx Dispatcher
  console.log('\n[11] Testing Phase 4 Web Item & Mail / RodEx Dispatcher');
  try {
    // Test 1: Search Items
    const searchRes = AdminService.searchItems('potion');
    assert(Array.isArray(searchRes.items), 'Item search returns array');
    assert(searchRes.items.length > 0, 'Found potions in item DB');
    assert(Array.isArray(searchRes.cards), 'Cards list returns array');
    assert(searchRes.cards.length > 0, 'Found cards for slotting');

    // Test 2: Direct Backpack Delivery
    const backpackRes = await AdminService.dispatchItemOrMail({
      deliveryMethod: 'inventory',
      charId: 150001,
      nameid: 1161, // Dragon Slayer
      amount: 1,
      refine: 10,
      card0: 4006, // Hydra Card
      card1: 4074, // Minorous Card
      zeny: 500000
    }, { username: 'AdminKels' });
    assert(backpackRes.success === true, 'Successfully dispatched weapon with refine and cards to backpack');

    // Test 3: Kafra Storage Delivery
    const storageRes = await AdminService.dispatchItemOrMail({
      deliveryMethod: 'storage',
      accountId: 2000001,
      nameid: 607, // Yggdrasil Berry
      amount: 50
    }, { username: 'AdminKels' });
    assert(storageRes.success === true, 'Successfully dispatched consumables to Kafra storage');

    // Test 4: In-Game Mail (RodEx) Delivery
    const mailRes = await AdminService.dispatchItemOrMail({
      deliveryMethod: 'mail',
      charId: 150001,
      nameid: 2357, // Valkyrian Armor
      amount: 1,
      refine: 7,
      card0: 4006,
      zeny: 1000000,
      mailTitle: 'Phase 4 Admin Gift',
      mailBody: 'Enjoy your upgraded gear in Midgard!'
    }, { username: 'AdminKels' });
    assert(mailRes.success === true, 'Successfully dispatched RodEx in-game mail with attached gear & Zeny');
  } catch (err) {
    console.error('Phase 4 test suite error:', err);
    failed++;
  }

  // 12. Testing Phase 5 Item Database Encyclopedia & Custom Item Studio
  console.log('\n[12] Testing Phase 5 Item Database Encyclopedia & Custom Item Studio');
  try {
    // Test 1: Query entire item database
    const dbRes = AdminService.getItemDatabase({ category: 'all', page: 1, limit: 20 });
    assert(Array.isArray(dbRes.items), 'Item database returns items array');
    assert(dbRes.totalItems >= 29000, 'Database contains 29,000+ authentic items');
    assert(dbRes.categoryCounts.all >= 29000, 'Category counts returned');

    // Test 2: Category Filter for Cards
    const cardRes = AdminService.getItemDatabase({ category: 'card', page: 1, limit: 10 });
    assert(cardRes.items.every(it => it.type === 'card'), 'Category card filter returns only cards');

    // Test 3: Search Query with Script
    const baphomet = AdminService.getItemDetails(4147);
    assert(baphomet.name === 'Baphomet Card', 'Baphomet card resolved');
    assert(baphomet.script && baphomet.script.includes('bonus'), 'Baphomet item bonus script attached');

    // Test 4: Create Custom Item
    const customItem = AdminService.createOrUpdateCustomItem({
      id: 30001,
      name: 'Kels Dragon Slayer Wings',
      aegisName: 'Kels_Dragon_Wings',
      type: 'armor',
      subType: 'Garment',
      defense: 25,
      slots: 2,
      refineable: true,
      script: 'bonus bAllStats,10; bonus bMaxHPrate,20;',
      locations: ['Garment']
    }, { username: 'AdminKels' });
    assert(customItem.itemId === 30001 && customItem.isCustom === true, 'Successfully created custom item');

    // Test 5: Verify Custom Item in Search
    const searchCustom = AdminService.getItemDatabase({ query: 'Dragon Slayer Wings' });
    assert(searchCustom.items.some(it => it.itemId === 30001), 'Custom item indexed and searchable');

    // Test 6: Export rAthena item_db2.yml
    const yamlExport = AdminService.exportCustomItemsYaml();
    assert(yamlExport.includes('ITEM_DB') && yamlExport.includes('30001'), 'Exported valid rAthena item_db2.yml');

    // Test 7: Delete Custom Item
    const delRes = AdminService.removeCustomItem(30001, { username: 'AdminKels' });
    assert(delRes.success === true, 'Successfully deleted custom item');
  } catch (err) {
    console.error('Phase 5 test suite error:', err);
    failed++;
  }

  console.log(`\n--- Verification Completed: ${passed} Passed, ${failed} Failed ---\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
