import React, { createContext, useCallback, useContext, useMemo } from "react";
import { contractAddress } from "../utils/constants";
import { useWalletValue } from "./WalletProvider";
// const tronweb = require("tronweb");

const contractProviderContext = createContext();

function ContractProvider({ children }) {
  const { tronWeb, wallet } = useWalletValue();

  //   const fullNode = "https://api.shasta.trongrid.io";
  //   const solidityNode = "https://api.shasta.trongrid.io";
  //   const eventServer = "https://api.shasta.trongrid.io";
  //   const tronWeb = useMemo(
  //     () => new tronweb(fullNode, solidityNode, eventServer),
  //     []
  //   );

  // const contract = async () => await tronWeb?.contract().at(contractAddress);
  const addUser = useCallback(
    async (address, email, username, twitter) => {
      let contract1 = await tronWeb.contract().at(contractAddress);
      let add = await contract1
        .addUser(address, username, twitter, email)
        .send();
      return add;
    },
    [tronWeb]
  );
  const getProfile = useCallback(
    async (address) => {
      if (wallet) {
        console.log(tronWeb);
        const contract = await tronWeb?.contract().at(contractAddress);
        console.log(contract);
        console.log();
        let profile = await contract.userMap(wallet).call();
        return profile;
      } else {
        return "";
      }
    },
    [tronWeb, wallet]
  );
  const values = useMemo(() => {
    return { addUser, getProfile };
  }, [addUser, getProfile]);

  return (
    <contractProviderContext.Provider value={values}>
      {children}
    </contractProviderContext.Provider>
  );
}

export default ContractProvider;
export const useContractValue = () => useContext(contractProviderContext);