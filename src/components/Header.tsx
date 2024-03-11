import Image from "next/image";
import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import eckoLogo from "@/assets/eckoDEX.svg";
import kdxLogo from "@/assets/kdx-crypto.svg";
import { useRouter } from "next/router";

const style = {
  wrapper: `p-4 w-screen flex justify-between items-center`,
  headerLogo: `flex w-1/4 items-center justify-start`,
  nav: `flex-1 flex justify-center items-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl`,
  activeNavItem: `bg-[#20242A]`,
  buttonsContainer: `flex w-1/4 justify-end items-center`,
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer`,
  buttonPadding: `p-2`,
  buttonTextContainer: `h-8 flex items-center`,
  buttonIconContainer: `flex items-center justify-center w-8 h-8`,
  buttonAccent: `bg-[#172A42] border border-[#163256] hover:border-[#234169] h-full rounded-2xl flex items-center justify-center text-[#4F90EA]`,
};

const Header = () => {
  const router = useRouter();
  const [selectedNav, setSelectedNav] = useState(router.route);

  useEffect(() => {
    setSelectedNav(router.route);
  }, [router]);

  const onMenuItemClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.headerLogo}>
        <Image src={eckoLogo} alt="ecko" height={100} width={100} />
      </div>
      <div className={style.nav}>
        <div className={style.navItemsContainer}>
          <div
            onClick={() => onMenuItemClick("/")}
            className={`${style.navItem} ${
              selectedNav === "/" && style.activeNavItem
            }`}
          >
            Faucet
          </div>
          <div
            onClick={() => onMenuItemClick("/genkeypair")}
            className={`${style.navItem} ${
              selectedNav === "/genkeypair" && style.activeNavItem
            }`}
          >
            Generate
          </div>
          <div
            onClick={() => onMenuItemClick("/txstatus")}
            className={`${style.navItem} ${
              selectedNav === "/txstatus" && style.activeNavItem
            }`}
          >
            Tx Status
          </div>
          <a
            href="https://testnet-swap.ecko.finance"
            target="_blank"
            rel="noreferrer"
          >
            <div className={style.navItem}>
              DEX <FiArrowUpRight />
            </div>
          </a>
        </div>
      </div>
      <div className={style.buttonsContainer}>
        <div className={`${style.button} ${style.buttonPadding}`}>
          <div className={style.buttonIconContainer}>
            <Image src={kdxLogo} alt="kdx logo" height={20} width={20} />
          </div>
          <p>Testnet - Chain 1</p>
          {/* <div className={style.buttonIconContainer}>
            <AiOutlineDown />
          </div> */}
        </div>
        <div className={`${style.button} ${style.buttonPadding}`}>
          <div className={`${style.buttonIconContainer} mx-2`}>
            <HiOutlineDotsVertical />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
