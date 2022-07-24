import React, { useCallback, useState } from "react";
import tron from "../assets/tron.png";
import {
  AiFillTwitterSquare,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineLink,
} from "react-icons/ai";
import banner from "../assets/banner.png";
// import loader from "../assets/Spinner.svg";
import { useWalletValue } from "../providers/WalletProvider";
// import sweetalert from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
import Button from "../components/Button";
import { FaDiscord, FaGoogle, FaShareAlt } from "react-icons/fa";
import { signInwithGoogle } from "../utils/discordAuth";
import { useContractValue } from "../providers/ContractProvider";
import SwalInput from "../components/SwalInput";
import { useProfileContext } from "../providers/ProfileProvider";
import Swal from "sweetalert2";

// const MySwal = withReactContent(sweetalert);
const Modal = ({ profileForm, setProfileForm, submit }) => {
  // const { getUsers } = useContractValue();

  const changeHandler = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setProfileForm((prev) => {
      return { ...prev, [name]: value };
    });
    console.log(profileForm);
  };

  const { Email, Twitter, Username } = profileForm;
  return (
    <div className="fixed top-0 left-0 w-full h-[100vh] justify-center flex items-center bg-[#000c]">
      <div className="bg-slate-900 md:w-1/2 w-[95] p-10">
        <SwalInput
          handleChange={changeHandler}
          value={Username}
          label={"Username"}
        ></SwalInput>
        <SwalInput
          handleChange={changeHandler}
          value={Twitter}
          label={"Twitter"}
        ></SwalInput>
        <SwalInput
          value={Email}
          label={"Email"}
          disabled={true}
          handleChange={changeHandler}
        ></SwalInput>
        <Button
          onClick={() => {
            submit();
          }}
          className={"mt-10 gap-1 mx-auto"}
        >
          <AiOutlineLink className="text-xl" />
          <div>Link Account</div>
        </Button>
      </div>
    </div>
  );
};

function ProfilePage() {
  const [modal, setModal] = useState();
  const { wallet } = useWalletValue();
  const { addUser, getUsers } = useContractValue();
  const { profile } = useProfileContext();
  const [profileForm, setProfileForm] = useState({
    Email: "",
    Twitter: "",
    Username: "",
    image: "",
  });

  const signIn = useCallback(async () => {
    signInwithGoogle()
      .then((res) => {
        console.log(res);
        let email = res["_tokenResponse"].email;
        let img = res["_tokenResponse"].photoUrl;
        setProfileForm((prev) => {
          return { ...prev, Email: email, image: img };
        });
        setModal(true);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          // footer: '<a href="">Why do I have this issue?</a>',
        });
        setModal(false);
      });
  }, []);
  const submitProfile = () => {
    let { Email, Username, Twitter, image } = profileForm;
    const validate = () => {
      getUsers().then((res) => {
        console.log(res);
        let reciepien = [];
        if (Username && Twitter) {
          for (let user in res) {
            console.log(res[user].userName);
            if (res[user].userName === Username) {
              reciepien.push("username is taken");
              break;
            }
          }
          for (let user in res) {
            console.log(res[user].twitterHandle);
            if (res[user].twitterHandle === Twitter) {
              reciepien.push("Twitter username is taken");
              break;
            }
          }
          for (let user in res) {
            console.log(res[user].twitterHandle);
            if (res[user].emailAddress === Email) {
              reciepien.push("Email is already registered");
              break;
            }
          }

          console.log(reciepien.length);
          if (reciepien.length === 0) {
            console.log("hello");
            addUser(wallet, Username, Twitter, Email, image)
              .then(() => {
                setModal(false);
                Swal.fire({
                  icon: "success",
                  title: "Successful",
                  text: "Social accounts linked successfully",
                  // footer: '<a href="">Why do I have this issue?</a>',
                });
              })
              .catch((err) => {
                console.log(err);
                setModal(false);
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                  // footer: '<a href="">Why do I have this issue?</a>',
                });
              });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: reciepien,
            });
          }
        }
      });
    };
    validate();
  };

  return (
    <div>
      <div>
        <div className="profile h-[40vh]"></div>
      </div>
      <div className="px-5 md:px-10 md:-mt-20 -mt-[50px]">
        <img
          src={banner}
          alt=""
          className="md:w-[150px] w-[100px] outline outline-10 outline-slate-800 block md:h-[150px] h-[100px] rounded-full"
        />

        <div className="pt-5 flex flex-wrap justify-between items-center">
          {!profile && <p className="text-white truncate">{wallet}</p>}
          {profile && (
            <div className="text-white">
              {profile?.emailAddress} {profile?.twitterHandle}
            </div>
          )}
          <div className="flex text-white text-3xl gap-2">
            <a href="/">
              <AiFillTwitterSquare />
            </a>
            <a href="/">
              <FaDiscord />
            </a>
            <a href="/">
              <FaShareAlt />
            </a>
          </div>
        </div>

        <div className="text-white mt-10">
          <h1>Connect Account</h1>
          <div className="flex flex-wrap gap-3 mt-5">
            {profile ? (
              <Button className={"bg-gray-700 hover:bg-gray-600"} disabled>
                Account Connected
              </Button>
            ) : (
              <Button onClick={signIn}>
                <FaGoogle /> Gmail
              </Button>
            )}
          </div>
        </div>
        <div className="text-white mt-10">
          <h1>Recent History</h1>
          {/* <img className="block max-w-full" alt="" src={loader} /> */}
          <div className="flex mt-5 flex-wrap">
            <div className="rounded p-2 relative bg-slate-700 w-[90%] mx-auto md:w-1/5">
              <div className="flex justify-between">
                <AiOutlineClockCircle className="text-2xl text-yellow-600" />
                <div>
                  <button className="bg-green-700 px-5 rounded-full">IN</button>
                </div>
              </div>
              <div className="flex mt-3 justify-between items-end">
                <div>
                  <div>at: 23/15/2022</div>
                  <div>from: TRES....iOy5</div>
                  <div>to: TRES....iOy5</div>
                </div>
                <div>
                  <div className="flex items-center">
                    <img src={tron} alt="" width={"20px"}></img>
                    <div>100</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 h-[99px] overflow-y-scroll max-h-[100px]">
                this is for note...
              </div>
              <button className="rounded-full px-7 py-2.5 mx-auto bg-green-500 block">
                Claim
              </button>
            </div>
            <div className="rounded p-2 relative bg-slate-700 w-[90%] mx-auto md:w-1/5">
              <div className="flex justify-between">
                <AiOutlineClockCircle className="text-2xl text-yellow-600" />
                <div>
                  <button className="bg-red-700 px-5 rounded-full">OUT</button>
                </div>
              </div>
              <div className="flex mt-3 justify-between items-end">
                <div>
                  <div>at: 23/15/2022</div>
                  <div>from: TRES....iOy5</div>
                  <div>to: TRES....iOy5</div>
                </div>
                <div>
                  <div className="flex items-center">
                    <img src={tron} alt="" width={"20px"}></img>
                    <div>100</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 h-[99px] overflow-y-scroll max-h-[100px]">
                this is for note...
              </div>
              <button className="rounded-full px-7 py-2.5 mx-auto bg-red-500 block">
                Revert
              </button>
            </div>
            <div className="rounded p-2 relative bg-slate-700 w-[90%] mx-auto md:w-1/5">
              <div className="flex justify-between">
                <AiOutlineCheckCircle className="text-2xl text-green-600" />
                <div>
                  <button className="bg-green-700 px-5 rounded-full">IN</button>
                </div>
              </div>
              <div className="flex mt-3 justify-between items-end">
                <div>
                  <div>at: 23/15/2022</div>
                  <div>from: TRES....iOy5</div>
                  <div>to: TRES....iOy5</div>
                </div>
                <div>
                  <div className="flex items-center">
                    <img src={tron} alt="" width={"20px"}></img>
                    <div>100</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 h-[99px] overflow-y-scroll max-h-[100px]">
                this is for note...
              </div>
              <button className="rounded-full px-7 py-2.5 mx-auto bg-green-900 block">
                Successful
              </button>
            </div>
            <div className="rounded p-2 relative bg-slate-700 w-[90%] mx-auto md:w-1/5">
              <div className="flex justify-between">
                <AiOutlineClockCircle className="text-2xl text-yellow-600" />
                <div>
                  <button className="bg-green-700 px-5 rounded-full">IN</button>
                </div>
              </div>
              <div className="flex mt-3 justify-between items-end">
                <div>
                  <div>at: 23/15/2022</div>
                  <div>from: TRES....iOy5</div>
                  <div>to: TRES....iOy5</div>
                </div>
                <div>
                  <div className="flex items-center">
                    <img src={tron} width={"20px"} alt=""></img>
                    <div>100</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 h-[99px] overflow-y-scroll max-h-[100px]">
                this is for note...
              </div>
              <button className="rounded-full px-7 py-2.5 mx-auto bg-green-500 block">
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <Modal
          submit={submitProfile}
          profileForm={profileForm}
          setProfileForm={setProfileForm}
        />
      )}
    </div>
  );
}

export default ProfilePage;
