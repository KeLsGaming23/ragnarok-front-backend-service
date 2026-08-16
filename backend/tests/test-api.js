/**
 * Backend API & Utility Verification Test Suite
 */
import { hashPassword, verifyPassword } from '../src/utils/passwordUtils.js';
import { getJobInfo } from '../src/utils/classNames.js';
import { pingTcpPort } from '../src/utils/tcpPing.js';
import { registerSchema, loginSchema } from '../src/validators/authValidator.js';
import { AuthService } from '../src/services/authService.js';
import { AccountRepository } from '../src/repositories/accountRepository.js';
import { ServerStatusService } from '../src/services/serverStatusService.js';

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

  // 1. Test Password Hashing & Verification (rAthena VARCHAR(32) MD5)
  console.log('[1] Testing Password Utilities (rAthena VARCHAR(32) MD5)');
  const plain = 'RagnarokSecret123!';
  const hashed = await hashPassword(plain, 'md5');
  assert(hashed.length === 32, 'MD5 hash is exactly 32 characters in length (VARCHAR(32) compliant)');
  assert(/^[a-f0-9]{32}$/.test(hashed), 'MD5 hash is valid 32-character hexadecimal string');
  const validMatch = await verifyPassword(plain, hashed);
  assert(validMatch === true, 'Valid password successfully verified with rAthena MD5 algorithm');
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
  assert(status.host === '54.253.142.107', 'Host IP matches 54.253.142.107');
  assert(status.services.loginServer.port === 6900, 'Login port is 6900');
  assert(status.services.charServer.port === 6121, 'Char port is 6121');
  assert(status.services.mapServer.port === 5121, 'Map port is 5121');
  assert(typeof status.overallStatus === 'string', 'Overall status returned');

  console.log(`\n--- Verification Completed: ${passed} Passed, ${failed} Failed ---\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
