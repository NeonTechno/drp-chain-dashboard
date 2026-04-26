/**
 * DRP Chain Dashboard — Mock Data Engine
 * Simulates real DRP node RPC responses.
 * Set MOCK_MODE = false and fill NODE_RPC to connect to a live node.
 */

const MOCK_MODE = true;
const NODE_RPC  = 'http://localhost:26657'; // Your DRP node RPC

// ── Simulation state
let _blockHeight  = 142_850 + Math.floor(Math.random() * 500);
let _txsToday     = 8_412   + Math.floor(Math.random() * 300);
let _deriPrice    = 0.0382;
let _rightsPrice  = 1.247;
let _deriHistory  = [];
let _rightsHistory= [];

const VALIDATORS = [
  'drp1gh4na', 'drp1accra', 'drp1kumasi', 'drp1takor', 'drp1tema01',
  'drp1node6', 'drp1node7', 'drp1cosm01'
];
const TX_TYPES = [
  'TRANSFER', 'STAKE', 'UNSTAKE', 'CLAIM_RIGHTS', 'SUBMIT_PoS',
  'VOTE', 'DELEGATE', 'REGISTER_ASSET', 'BURN_DeRi', 'LAZARUS_RECOVER'
];
const POS_ROLES   = ['FARMER', 'STUDENT', 'VENDOR', 'INNOVATOR', 'EDUCATOR', 'MEDIC'];
const POS_ACTIONS = [
  'completed crop yield report',
  'passed blockchain literacy quiz',
  'submitted clean energy proof',
  'registered food distribution record',
  'uploaded skill verification',
  'filed corruption evidence',
  'claimed education reward',
  'verified healthcare access'
];

function _rand(min, max) { return Math.random() * (max - min) + min; }
function _randInt(min, max) { return Math.floor(_rand(min, max)); }
function _hex(len) {
  return Array.from({length: len}, () => Math.floor(Math.random()*16).toString(16)).join('');
}
function _shortAddr() {
  return 'drp1' + _hex(6) + '…' + _hex(4);
}

// Initialise price histories
for (let i = 0; i < 40; i++) {
  _deriPrice    += _rand(-0.001, 0.001);
  _rightsPrice  += _rand(-0.01,  0.01);
  _deriHistory.push(Math.max(0.001, _deriPrice));
  _rightsHistory.push(Math.max(0.01, _rightsPrice));
}

// ── Public API (mirrors what a real Cosmos RPC would return)
const DRP_API = {
  getChainStatus() {
    return {
      chainId:       'drp-testnet-1',
      blockHeight:   _blockHeight,
      blockHash:     '0x' + _hex(4) + '…' + _hex(4),
      validators:    21,
      bondedRights:  42_000_000,
      bondedPct:     68.4,
      avgBlockTime:  '6.2s',
      txsToday:      _txsToday,
      txDelta:       _randInt(0, 8),
    };
  },

  getNewBlock() {
    _blockHeight++;
    const txCount = _randInt(0, 12);
    _txsToday += txCount;
    return {
      height:    _blockHeight,
      hash:      '0x' + _hex(4) + '…' + _hex(4),
      validator: VALIDATORS[_randInt(0, VALIDATORS.length)],
      txs:       txCount,
      gas:       _randInt(20_000, 800_000),
      age:       'just now',
    };
  },

  getTokenPrices() {
    _deriPrice   += _rand(-0.0008, 0.0010);
    _rightsPrice += _rand(-0.006, 0.008);
    _deriPrice    = Math.max(0.001, _deriPrice);
    _rightsPrice  = Math.max(0.01, _rightsPrice);
    _deriHistory.push(_deriPrice);
    _rightsHistory.push(_rightsPrice);
    if (_deriHistory.length   > 60) _deriHistory.shift();
    if (_rightsHistory.length > 60) _rightsHistory.shift();
    return {
      deriPrice:     _deriPrice,
      deriChange:    _rand(-2.5, 3.5),
      rightsPrice:   _rightsPrice,
      rightsChange:  _rand(-1.5, 2.5),
      deriHistory:   [..._deriHistory],
      rightsHistory: [..._rightsHistory],
    };
  },

  getNodes() {
    return [
      { name: 'validator-accra-01',  status: 'online',  ping: 12,  lat: 'Accra, GH'    },
      { name: 'validator-kumasi-01', status: 'online',  ping: 18,  lat: 'Kumasi, GH'   },
      { name: 'validator-tema-01',   status: 'online',  ping: 21,  lat: 'Tema, GH'     },
      { name: 'relay-london-01',     status: 'online',  ping: 89,  lat: 'London, UK'   },
      { name: 'relay-singapore-01',  status: 'syncing', ping: 145, lat: 'Singapore, SG'},
      { name: 'seed-newyork-01',     status: 'online',  ping: 112, lat: 'New York, US' },
      { name: 'relay-nairobi-01',    status: 'online',  ping: 34,  lat: 'Nairobi, KE'  },
      { name: 'validator-node-08',   status: 'offline', ping: null, lat: 'Unknown'     },
    ];
  },

  getMempoolTx() {
    const priorities = ['high', 'medium', 'low'];
    return {
      hash:     '0x' + _hex(8),
      type:     TX_TYPES[_randInt(0, TX_TYPES.length)],
      priority: priorities[_randInt(0, priorities.length)],
      fee:      (_rand(0.001, 0.5)).toFixed(4) + ' DeRi',
    };
  },

  getPosEvent() {
    return {
      role:   POS_ROLES[_randInt(0, POS_ROLES.length)],
      addr:   _shortAddr(),
      action: POS_ACTIONS[_randInt(0, POS_ACTIONS.length)],
      score:  '+' + _randInt(10, 150) + ' pts',
    };
  },
};
