import React, { useCallback, useState } from "react";
import { AiFillTwitterSquare } from "react-icons/ai";
import banner from "../assets/banner.png";
import loader from "../assets/Spinner.svg";
import { useWalletValue } from "../providers/WalletProvider";
import swal from "@sweetalert/with-react";
import Button from "../components/Button";
import { FaDiscord, FaGoogle, FaShareAlt } from "react-icons/fa";
import { signInwithGoogle } from "../utils/discordAuth";
import { useContractValue } from "../providers/ContractProvider";
// import Input from "../components/Input";
import SwalInput from "../components/SwalInput";
import { useProfileContext } from "../providers/ProfileProvider";
// import { async } from "@firebase/util";
// import axios from "axios";

function ProfilePage() {
  const { wallet } = useWalletValue();
  const { addUser } = useContractValue();
  const { profile } = useProfileContext();
  const [profileForm, setProfileForm] = useState({
    Email: "",
    Twitter: "hhdhdhh",
    Username: "",
  });
  console.log(profileForm);

  const changeHandler = useCallback(
    (e) => {
      console.log(profileForm);
      const { name, value } = e.target;
      setProfileForm((prev) => {
        return { ...prev, [name]: value };
      });
      console.log(profileForm);
    },
    [setProfileForm, profileForm]
  );

  const signIn = useCallback(async () => {
    await signInwithGoogle()
      .then((res) => {
        let email = res["_tokenResponse"].email;
        setProfileForm((prev) => {
          return { ...prev, Email: email };
        });
        swal({
          button: {
            text: "Link Accounts",
            closeModal: false,
            showCloseButton: true,
          },
          content: (
            <div>
              <SwalInput
                handleChange={changeHandler}
                value={"hhhh"}
                label={"Username"}
              ></SwalInput>
              <SwalInput
                handleChange={changeHandler}
                value={profileForm.Twitter}
                label={"Twitter"}
              ></SwalInput>
              <SwalInput
                value={email}
                label={"Email"}
                disabled={true}
                handleChange={changeHandler}
              ></SwalInput>
              <input name="Email" onChange={(e) => changeHandler(e)} />
            </div>
          ),
        }).then(async () => {
          // const { Email, Twitter, Username } = profileForm;
          await addUser(wallet, email, "Mumeen", "Twitter")
            .then(() => {
              swal("successfull");
            })
            .catch(() => {
              swal("error");
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [profileForm, addUser, changeHandler, wallet]);
  // const token = window.location.search.substring(1).split("=")[1];
  // let data = useCallback(() => {
  //   let param = new URLSearchParams({
  //     client_id: "992266095601909840",
  //     client_secret: "v1Hu3p4dCmtX0AJyTEBRQhz-Hxq_ixP3",
  //     grant_type: "authorization_code",
  //     code: token,
  //     redirect_uri: "http://localhost:3000/profile",
  //   });
  //   return param;
  // }, [token]);
  // const data1 = useMemo(() => data(), [data]);
  // const getToken = useCallback(async () => {
  //   let data = await axios
  //     .post("https://discord.com/api/oauth2/token", data1, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     })
  //     .then((res) => res.data);
  //   return data;
  // }, [data1]);

  // console.log(data1);
  // useEffect(() => {
  //   if (token) {
  //     async function getProfile() {
  //       let token1 = await getToken();
  //       console.log(token1.access_token);
  //       let profile = await axios
  //         .get("https://www.discord.com/api/v10/users/@me", {
  //           headers: { Authorization: `Bearer ${token1.access_token}` },
  //         })
  //         .then((res) => res.data);
  //       console.log(profile);
  //     }

  //     getProfile();
  //   }
  // }, [getToken, token]);
  const contract = useContractValue();
  console.log(contract);

  return (
    <div>
      <div>
        <img src={banner} alt="" className="w-full block max-h-[300px]" />
      </div>
      <div className="px-5 md:px-10 md:-mt-20 -mt-[50px]">
        <img
          src={banner}
          alt=""
          className="md:w-[150px] w-[100px] outline outline-10 outline-white block md:h-[150px] h-[100px] rounded-full"
        />

        <div className="pt-5 flex flex-wrap justify-between items-center">
          {!profile && <p className="text-white truncate">{wallet}</p>}
          {profile && <div className="text-white">{profile?.emailAddress}</div>}
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
          <img className="block max-w-full" alt="" src={loader} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
