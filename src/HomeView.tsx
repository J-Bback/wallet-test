import React, { FC, useState, useEffect, useMemo } from "react";
import * as web3 from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

export const HomeView: FC = ({}) => {
	const wallet = useAnchorWallet();
	const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [balance, setBalance] = useState<number>();
  const [amount, setAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');

	const [receiver, setReceiver] = useState(
		"3scBXUWsTyxQ9LiZSVdFu4RdmMQntt1eicMtkxbVWqbZ"
	);
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
    if (!publicKey) throw new WalletNotConnectedError();    
      let airdropSignature = await connection.requestAirdrop(publicKey, Number(amount) * (10 ** 9));
      await connection.confirmTransaction(airdropSignature);
      window.location.reload();
  }

    const setSendSol = async () => {
      if (!publicKey) throw new WalletNotConnectedError();    
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new web3.PublicKey(receiver),
          lamports: Number(sendAmount) * (10 ** 9)
        })
      );
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      window.location.reload();
    };
	return (
		<main>
			<p>{publicKey ? <>Your address: {publicKey.toBase58()}</> : null}</p>
			{wallet && <p>Balance(Sol): {(balance || 0).toLocaleString()}</p>}
			<form>
				<input
					name={"Airdrop"}
					placeholder="airdrop input"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
				/>
				<input type="button" onClick={setAirdrop} value="airdrop" />
			</form>
			<form>
				<input
					name={"Send"}
					placeholder="send input"
					value={sendAmount}
					onChange={(e) => setSendAmount(e.target.value)}
				/>
				<input type="button" onClick={setSendSol} value="send" />
			</form>
			<p>{receiver ? <>Receiver address: {receiver}</> : null}</p>
			{receiver && (
				<p>Receiver Balance(Sol): {(receiverBalance || 0).toLocaleString()}</p>
			)}
		</main>
	);
};