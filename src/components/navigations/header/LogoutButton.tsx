
// path : src/components/navigations/header/LogoutButton.tsx

"use client";
import axios from "axios";
import {DOMAIN} from '@/utils/constants';
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

const LogoutButton = () => {
    const router = useRouter();
    const logoutHandler = async () => {
        try {

            await axios.get(`${DOMAIN}/api/v1/users/logout`);
            localStorage.removeItem("simulationResults");
            router.push("/");
            router.refresh();
        } catch (error) {
            toast.warning("Something went wrong");
            console.log(error);
        }
    }

    return (
        <button onClick={logoutHandler} className=" bg-gray-700 text-gray-200 p-2 rounded">
            Se déconnecter
        </button>
    )
}

export default LogoutButton;
