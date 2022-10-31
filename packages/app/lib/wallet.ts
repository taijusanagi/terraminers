import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { Chain, chain, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const trustChain: Chain = {
  id: 15555,
  name: "TrustEVM",
  network: "trastEVM",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum VM",
    symbol: "EVM",
  },
  rpcUrls: {
    default: "https://api.testnet-dev.trust.one/",
  },
  blockExplorers: {
    default: { name: "TrustScan", url: "https://trustscan.one/" },
  },
  testnet: true,
};

const { chains, provider } = configureChains([trustChain], [publicProvider()]);

export interface RainbowWeb3AuthConnectorProps {
  chains: Chain[];
}

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

export { chains };

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
