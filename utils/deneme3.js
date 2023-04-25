const { ethers } = require('ethers');
const bytecode = "0x60806040526004361061008a5760003560e01c80639e281a98116100595780639e281a981461013c578063f14210a614610165578063f2fde38b1461018e578063f6326fb3146101b7578063fc0c546a146101c157610091565b80631aa2b64e14610093578063338b5dea146100d1578063715018a6146100fa5780638da5cb5b1461011157610091565b3661009157005b005b34801561009f57600080fd5b506100ba60048036038101906100b59190610c97565b6101ec565b6040516100c8929190610cf9565b60405180910390f35b3480156100dd57600080fd5b506100f860048036038101906100f39190610d22565b610827565b005b34801561010657600080fd5b5061010f6108ac565b005b34801561011d57600080fd5b506101266108c0565b6040516101339190610d71565b60405180910390f35b34801561014857600080fd5b50610163600480360381019061015e9190610d22565b6108e9565b005b34801561017157600080fd5b5061018c60048036038101906101879190610d8c565b610974565b005b34801561019a57600080fd5b506101b560048036038101906101b09190610db9565b610a09565b005b6101bf610a8c565b005b3480156101cd57600080fd5b506101d6610a8e565b6040516101e39190610e45565b60405180910390f35b60008083471015610232576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161022990610ee3565b60405180910390fd5b6000600267ffffffffffffffff81111561024f5761024e610f03565b5b60405190808252806020026020018201604052801561027d5781602001602082028036833780820191505090505b50905073b4fbf271143f4fbf7b91a5ded31805e42b2208d6816000815181106102a9576102a8610f32565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505085816001815181106102f8576102f7610f32565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250506000479050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b6f9de9587600085308a6040518663ffffffff1660e01b815260040161039a949392919061105a565b6000604051808303818588803b1580156103b357600080fd5b505af11580156103c7573d6000803e3d6000fd5b505050505060008773ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016104079190610d71565b602060405180830381865afa158015610424573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061044891906110bb565b90506000811161048d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161048490611134565b60405180910390fd5b60004790508873ffffffffffffffffffffffffffffffffffffffff1663095ea7b3737a250d5630b4cf539739df2c5dacb4c659f2488d6004546040518363ffffffff1660e01b81526004016104e3929190611154565b6020604051808303816000875af1158015610502573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061052691906111b5565b506000600267ffffffffffffffff81111561054457610543610f03565b5b6040519080825280602002602001820160405280156105725781602001602082028036833780820191505090505b509050898160008151811061058a57610589610f32565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505073b4fbf271143f4fbf7b91a5ded31805e42b2208d6816001815181106105ed576105ec610f32565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663791ac94784600084308d6040518663ffffffff1660e01b815260040161068b9594939291906111e2565b600060405180830381600087803b1580156106a557600080fd5b505af11580156106b9573d6000803e3d6000fd5b50505050600047905060008b73ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016106fd9190610d71565b602060405180830381865afa15801561071a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061073e91906110bb565b90506000600267ffffffffffffffff81111561075d5761075c610f03565b5b60405190808252806020026020018201604052801561078b5781602001602082028036833780820191505090505b50905085816000815181106107a3576107a2610f32565b5b60200260200101818152505084836107bb919061126b565b816001815181106107cf576107ce610f32565b5b602002602001018181525050806000815181106107ef576107ee610f32565b5b60200260200101518160018151811061080b5761080a610f32565b5b6020026020010151995099505050505050505050935093915050565b8173ffffffffffffffffffffffffffffffffffffffff166323b872dd3330846040518463ffffffff1660e01b81526004016108649392919061129f565b6020604051808303816000875af1158015610883573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108a791906111b5565b505050565b6108b4610ab4565b6108be6000610b32565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6108f1610ab4565b8173ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff1660e01b815260040161092c929190611154565b6020604051808303816000875af115801561094b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061096f91906111b5565b505050565b61097c610ab4565b478111156109bf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109b690611322565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610a05573d6000803e3d6000fd5b5050565b610a11610ab4565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610a80576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a77906113b4565b60405180910390fd5b610a8981610b32565b50565b565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610abc610bf6565b73ffffffffffffffffffffffffffffffffffffffff16610ada6108c0565b73ffffffffffffffffffffffffffffffffffffffff1614610b30576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b2790611420565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610c2e82610c03565b9050919050565b610c3e81610c23565b8114610c4957600080fd5b50565b600081359050610c5b81610c35565b92915050565b6000819050919050565b610c7481610c61565b8114610c7f57600080fd5b50565b600081359050610c9181610c6b565b92915050565b600080600060608486031215610cb057610caf610bfe565b5b6000610cbe86828701610c4c565b9350506020610ccf86828701610c82565b9250506040610ce086828701610c82565b9150509250925092565b610cf381610c61565b82525050565b6000604082019050610d0e6000830185610cea565b610d1b6020830184610cea565b9392505050565b60008060408385031215610d3957610d38610bfe565b5b6000610d4785828601610c4c565b9250506020610d5885828601610c82565b9150509250929050565b610d6b81610c23565b82525050565b6000602082019050610d866000830184610d62565b92915050565b600060208284031215610da257610da1610bfe565b5b6000610db084828501610c82565b91505092915050565b600060208284031215610dcf57610dce610bfe565b5b6000610ddd84828501610c4c565b91505092915050565b6000819050919050565b6000610e0b610e06610e0184610c03565b610de6565b610c03565b9050919050565b6000610e1d82610df0565b9050919050565b6000610e2f82610e12565b9050919050565b610e3f81610e24565b82525050565b6000602082019050610e5a6000830184610e36565b92915050565b600082825260208201905092915050565b7f436f6e747261637420646f6573206e6f74206861766520656e6f75676820457460008201527f68657220746f206578656375746520627579207472616e73616374696f6e0000602082015250565b6000610ecd603e83610e60565b9150610ed882610e71565b604082019050919050565b60006020820190508181036000830152610efc81610ec0565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000819050919050565b6000610f86610f81610f7c84610f61565b610de6565b610c61565b9050919050565b610f9681610f6b565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b610fd181610c23565b82525050565b6000610fe38383610fc8565b60208301905092915050565b6000602082019050919050565b600061100782610f9c565b6110118185610fa7565b935061101c83610fb8565b8060005b8381101561104d5781516110348882610fd7565b975061103f83610fef565b925050600181019050611020565b5085935050505092915050565b600060808201905061106f6000830187610f8d565b81810360208301526110818186610ffc565b90506110906040830185610d62565b61109d6060830184610cea565b95945050505050565b6000815190506110b581610c6b565b92915050565b6000602082840312156110d1576110d0610bfe565b5b60006110df848285016110a6565b91505092915050565b7f546f6b656e20616d6f756e742072656365697665642069732030000000000000600082015250565b600061111e601a83610e60565b9150611129826110e8565b602082019050919050565b6000602082019050818103600083015261114d81611111565b9050919050565b60006040820190506111696000830185610d62565b6111766020830184610cea565b9392505050565b60008115159050919050565b6111928161117d565b811461119d57600080fd5b50565b6000815190506111af81611189565b92915050565b6000602082840312156111cb576111ca610bfe565b5b60006111d9848285016111a0565b91505092915050565b600060a0820190506111f76000830188610cea565b6112046020830187610f8d565b81810360408301526112168186610ffc565b90506112256060830185610d62565b6112326080830184610cea565b9695505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061127682610c61565b915061128183610c61565b92508282039050818111156112995761129861123c565b5b92915050565b60006060820190506112b46000830186610d62565b6112c16020830185610d62565b6112ce6040830184610cea565b949350505050565b7f496e73756666696369656e742062616c616e6365000000000000000000000000600082015250565b600061130c601483610e60565b9150611317826112d6565b602082019050919050565b6000602082019050818103600083015261133b816112ff565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b600061139e602683610e60565b91506113a982611342565b604082019050919050565b600060208201905081810360008301526113cd81611391565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b600061140a602083610e60565b9150611415826113d4565b602082019050919050565b60006020820190508181036000830152611439816113fd565b905091905056fea26469706673582212202f63a72f64090bfb4c24d5edc7137717250ccdf676fc22651b599b499baaf9cd64736f6c63430008120033"; // bytecode of the contract
const opcodes = ethers.utils.solidityKeccak256(['bytes'], [bytecode]);
console.log(opcodes)
const relevantInstructions = []; // array to store the relevant instructions
for (let i = 0; i < opcodes.length; i += 2) {
  const opcode = opcodes.slice(i, i + 2);
  // analyze the opcode and determine if it's relevant
  if (opcode === '60' /* PUSH1 */) {
    const value = parseInt(opcodes.slice(i + 2, i + 4), 16);
    relevantInstructions.push({ opcode, value });
  } else if (opcode === 'a1' /* MSTORE */) {
    relevantInstructions.push({ opcode });
  }
  // add more conditions for other relevant opcodes
}
console.log(relevantInstructions)