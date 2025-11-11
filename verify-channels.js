// Test script to verify all channels are defined
// Run with: node verify-channels.js

const channels = require('./shared/constants/channels');

console.log('Verifying IPC channels...\n');

const requiredChannels = [
  'WEEK_GET_CURRENT',
  'WEEK_ARCHIVE',
  'WEEK_UPDATE_SUMMARY',
  'WEEK_GET_ARCHIVED',
  'WEEK_GET_STATS',
  'TASK_CREATE',
  'TASK_UPDATE',
  'TASK_DELETE',
  'TASK_TOGGLE',
  'TASK_REORDER',
  'TASK_TEMPLATE_CREATE',
  'TASK_TEMPLATE_GET_ALL',
  'TASK_TEMPLATE_DELETE',
  'MEAL_CREATE',
  'MEAL_UPDATE',
  'MEAL_DELETE',
  'MEAL_GET_CALORIES',
  'DAILY_DATA_UPDATE',
  'DAILY_DATA_GET',
  'BACKUP_CREATE',
  'BACKUP_LIST',
  'BACKUP_RESTORE'
];

let allValid = true;

requiredChannels.forEach(channel => {
  const value = channels[channel];
  if (!value) {
    console.error(`❌ Missing: ${channel}`);
    allValid = false;
  } else {
    console.log(`✓ ${channel} = "${value}"`);
  }
});

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('✅ All channels are defined correctly!');
  process.exit(0);
} else {
  console.log('❌ Some channels are missing or undefined');
  process.exit(1);
}

console.log('\nChannel values:');
console.log(JSON.stringify(channels, null, 2));