export default [
  {
    inputs: [
      { internalType: 'address', name: '_backendSigner', type: 'address' },
      { internalType: 'address', name: '_dgtToken', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'ECDSAInvalidSignature', type: 'error' },
  {
    inputs: [{ internalType: 'uint256', name: 'length', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 's', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'hashedMessage', type: 'bytes32' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'InvalidSignature',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'signature', type: 'bytes' }],
    name: 'SignatureAlreadyClaimed',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'length', type: 'uint256' },
    ],
    name: 'StringsInsufficientHexLength',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'TokenClaimReward',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'TokenDeposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'TokenUnstaked',
    type: 'event',
  },
  {
    inputs: [],
    name: 'backendSigner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'depositToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dgtToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    name: 'invalidSignature',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
      {
        components: [
          {
            internalType: 'enum DgenBank.WithdrawUSDTOps',
            name: 'ops',
            type: 'uint8',
          },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
        ],
        internalType: 'struct DgenBank.WithdrawUSDTSignaturePayload',
        name: 'payload',
        type: 'tuple',
      },
    ],
    name: 'withdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
