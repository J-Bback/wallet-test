import React, { FC, useState, useEffect, useMemo } from "react";
import * as web3 from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const HomeView: FC = ({}) => {
	// const treasury = new anchor.web3.PublicKey('3scBXUWsTyxQ9LiZSVdFu4RdmMQntt1eicMtkxbVWqbZ'!);
	// console.log('treasury', treasury);
	const wallet = useAnchorWallet();
	const { publicKey } = useWallet();
  const { connection } = useConnection();
  
  const [balance, setBalance] = useState<number>();
  const [amount, setAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');

  const [receiver, setReceiver] = useState('3scBXUWsTyxQ9LiZSVdFu4RdmMQntt1eicMtkxbVWqbZ');
  const [receiverBalance, setReceiverBalance] = useState<number>();


	useEffect(() => {
		(async () => {
			if (wallet) {
				const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
        if (receiver) {
          const receiverPubkey = new anchor.web3.PublicKey(receiver);
          const receiverBalance = await connection.getBalance(receiverPubkey);
          setReceiverBalance(receiverBalance / LAMPORTS_PER_SOL);
        }
			}
		})();
  }, [wallet, connection]);

    const setAirdrop = async () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'),'confirmed');
    if (publicKey) {
      let airdropSignature = await connection.requestAirdrop(publicKey, Number(amount) * (10 ** 9));
      console.log('airdropSignature', airdropSignature);
      await connection.confirmTransaction(airdropSignature);
      // connection.close();
    }
  }

    const setSendSol = async () => {
    // const connection = new web3.Connection(web3.clusterApiUrl('devnet'),'confirmed');
    // 여기서 실패.. 어떻게 키페어를 가져와야될까
    console.log('connection', connection);
    const keyPair = anchor.web3.Keypair.generate();
    console.log('keyPair', keyPair);
    const receiverPubkey = new anchor.web3.PublicKey(receiver);
    let transaction = new web3.Transaction();

    // Add an instruction to execute
    // transaction.add(web3.SystemProgram.transfer({
    //     fromPubkey: payer.publicKey,
    //     toPubkey: toPublicKey,
    //     lamports: this.state.amount,
    // }));

    // await web3.sendAndConfirmTransaction(connection, transaction, [payer])

    // connection.close()
  }

  console.log('receiverBalance', receiverBalance);
	return (
		<main>
			<p>{publicKey ? <>Your address: {publicKey.toBase58()}</> : null}</p>
			{wallet && <p>Balance(Sol): {(balance || 0).toLocaleString()}</p>}
			<form>
				<input
          name={'Airdrop'}
					placeholder='airdrop input'
          value={amount}
          onChange={e => setAmount(e.target.value)}
				/>
				<input type="button" onClick={setAirdrop} value="airdrop" />
			</form>
			<form>
				<input
          name={'Send'}
					placeholder='send input'
          value={sendAmount}
          onChange={e => setSendAmount(e.target.value)}
				/>
				<input type="button" onClick={setSendSol} value="send" />
			</form>
      <p>{receiver ? <>Receiver address: {receiver}</> : null}</p>
			{receiver && <p>Receiver Balance(Sol): {(receiverBalance || 0).toLocaleString()}</p>}
		</main>
	);
};
// class Home extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       fromPublicKey: 'DPiHuhF518ZAM4zfBRzwG2iGgeB9QBY8oXjYJCpfXmZz',
//       toPublicKey: '2VsyBLaCRSWiM3FF7vRuTTtthqn7Ne9hpWYA38DzfLzQ',
//       fromSecretKey: '',
//       result: '',
//       fromBalance: null,
//       toBalance: null,
//       amount: 0,
//       publicKey: this.props.publicKey,
//     }
//   };

//   getPublicKey = () => {
//     const { publicKey } = useWallet();
//     console.log('publicKey', publicKey);
//   }

//   handlePublicKeyInputChange = (e) => {
//     this.setState({ fromPublicKey: e.target.value })
//   }

//   handleAmountInputChange = (e) => {
//     this.setState({amount: e.target.value })
//   }

//   handleSecretInputChange = (e) => {
//     this.setState({ fromSecretKey: e.target.value })
//   }

//   handleYourPubilcInputChange = (e) => {
//     this.setState({ toPublicKey: e.target.value })
//   }

//   handleClick = async () => {
//     const lamports = await this.getBalance()
//     this.setState({ fromBalance: lamports });
//   }

//   handleAirdrop = async () => {
//     await this.setAirdrop()
//     const lamports = await this.getBalance()
//     this.setState({ fromBalance: lamports });
//   }

//   handleTransfer = async () => {
//     await this.sendSolana()
//     const myBalance = await this.getBalance()
//     this.setState({ fromBalance: myBalance });
//     const yourBalance = await this.getYourBalance()
//     this.setState({ toBalance: yourBalance });
//   }

//   getBalance = async () => {
//     const connection = new web3.Connection(web3.clusterApiUrl('devnet'),'confirmed');
//     const publicKey = new web3.PublicKey(this.state.fromPublicKey);
//     const account = await connection.getAccountInfo(publicKey);
//     return account.lamports
//   }

//   getYourBalance = async () => { // 두개 못합치나
//     const connection = new web3.Connection(web3.clusterApiUrl('devnet'),'confirmed');
//     const publicKey = new web3.PublicKey(this.state.toPublicKey);
//     const account = await connection.getAccountInfo(publicKey);
//     connection.close()
//     return account.lamports
//   }

//   setAirdrop = async () => {
//     const connection = new web3.Connection(web3.clusterApiUrl('devnet'),'confirmed');
//     const publicKey = new web3.PublicKey(this.state.fromPublicKey);
//     let airdropSignature = await connection.requestAirdrop(publicKey, Number(this.state.amount));
//     await connection.confirmTransaction(airdropSignature);
//     // connection.close()
//   }

//   sendSolana = async () => {
//     const connection = new web3.Connection(web3.clusterApiUrl('devnet'),'confirmed');
//     // 여기서 실패.. 어떻게 키페어를 가져와야될까
//     const payer = new web3.Keypair.fromSecretKey(this.state.fromSecretKey);
//     const toPublicKey = new web3.PublicKey(this.state.toPublicKey);
//     let transaction = new web3.Transaction();

//     // Add an instruction to execute
//     transaction.add(web3.SystemProgram.transfer({
//         fromPubkey: payer.publicKey,
//         toPubkey: toPublicKey,
//         lamports: this.state.amount,
//     }));

//     await web3.sendAndConfirmTransaction(connection, transaction, [payer])

//     // connection.close()
//   }

//   render() {
//     return (
//       <div>
//         <div>my public key: {this.getPublicKey}</div>
//         <div>my balance: {this.state.fromBalance}</div>
//         <form>
//           <input
//             placeholder="pubilc key"
//             value={this.state.fromPublicKey}
//             onChange={this.handlePublicKeyInputChange}
//           />
//           <input
//             type='button'
//             onClick={this.handleClick}
//             value='balance'
//           />
//         </form>
//         <form>
//           <input
//             placeholder="airdrop input"
//             value={this.state.amount}
//             onChange={this.handleAmountInputChange}
//           />
//           <input
//             type='button'
//             onClick={this.handleAirdrop}
//             value='airdrop'
//           />
//         </form>
//         <form>
//           <input
//             placeholder="my secret key"
//             value={this.state.fromSecretKey}
//             onChange={this.handleSecretInputChange}
//           />
//           <input
//             placeholder="your public key"
//             value={this.state.toPublicKey}
//             onChange={this.handleYourPubilcInputChange}
//           />
//           <input
//             type='button'
//             onClick={this.handleTransfer}
//             value='transfer sol'
//           />
//         </form>
//         <div>your balance: {this.state.toBalance}</div>
//       </div>
//     )
//   }
// }

// export default Home;
