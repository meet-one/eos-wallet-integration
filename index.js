// login dapp by Scatter or MEET.ONE
function login() {
  // The codes below come from https://get-scatter.com/docs/examples-interaction-flow

  // Don't forget to tell ScatterJS which plugins you are using.
  ScatterJS.plugins(new ScatterEOS());

  // Networks are used to reference certain blockchains.
  // They let you get accounts and help you build signature providers.
  var network = {
    blockchain: 'eos',
    protocol: 'https',
    host: 'mainnet.meet.one',
    port: '443',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
  };

  var dappName = 'eos-dapp-template';

  // First we need to connect to the user's Scatter.
  ScatterJS.scatter.connect(dappName).then(function (connected) {

    // If the user does not have Scatter or it is Locked or Closed this will return false;
    if (!connected) {
      console.log('connect to scatter failed.');
      return;
    } else {
      console.log('connected to scatter.');
    }

    var scatter = ScatterJS.scatter;

    // Now we need to get an identity from the user.
    // We're also going to require an account that is connected to the network we're using.
    var requiredFields = {accounts: [network]};
    scatter.getIdentity(requiredFields).then(function () {

      // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
      // the user for their account name beforehand. They could still give you a different account.
      // var account = scatter.identity.accounts.find(x => x.blockchain === 'eos');

      var account = scatter.identity.accounts[0];
      console.log(account);

      // You can pass in any additional options you want into the eosjs reference.
      var eosOptions = {expireInSeconds: 60};

      // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
      var eos = scatter.eos(network, Eos, eosOptions);

      // ----------------------------
      // Now that we have an identity,
      // an EOSIO account, and a reference
      // to an eosjs object we can send a transaction.
      // ----------------------------

      document.getElementById('login').classList.add('hide');
      document.getElementById('userName').innerHTML = account.name;

      eos.getAccount(account.name).then(function (result) {
        renderUserInfo(result);
      });

      // Never assume the account's permission/authority. Always take it from the returned account.
      var transactionOptions = {authorization: [account.name + '@' + account.authority]};

      // eos.transfer(account.name, 'eosiomeetone', '0.0001 EOS', 'sent from eos-wallet-integrate', transactionOptions).then(function (trx) {
      //   // That's it!
      //   console.log('Transaction' + trx);
      // }).catch(function (error) {
      //   console.error(error);
      // });

    }).catch(function (error) {
      // The user rejected this request, or doesn't have the appropriate requirements.
      console.log('connect to scatter failed.');
      console.log(error);
    });
  });
}

function renderUserInfo(userInfo) {
  console.log(userInfo);
  var ramUsage = parseInt(userInfo.ram_usage / userInfo.ram_quota * 100);
  var cpuUsage = parseInt(userInfo.cpu_limit.used / userInfo.cpu_limit.available * 100);
  var netUsage = parseInt(userInfo.net_limit.used / userInfo.net_limit.available * 100);

  document.getElementById('userName').innerHTML = userInfo.account_name;

  renderResources(ramUsage, 'ramUsage');
  renderResources(cpuUsage, 'cpuUsage');
  renderResources(netUsage, 'netUsage');

  document.getElementById('userInfo').classList.remove('hide');

}

function renderResources(usage, elementId) {

  if (usage < 1) {
    usage = 1;
  }

  if (usage > 100) {
    usage = 100;
  }

  usage = usage + '%';

  var usageObj = document.getElementById(elementId);
  usageObj.innerHTML = usage;
  usageObj.nextElementSibling.firstChild.nextElementSibling.style.width = usage;

}