import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "@/utils/axios";
import { USER_END_POINT } from "@/utils/constent";
import { setUser } from "@/redux/slices/authSlice";

function useGetProfile() {

    const dispatch = useDispatch();

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const res = await axiosInstance.get(
                    `${USER_END_POINT}/profile`
                );

                dispatch(
                    setUser(res.data.user)
                );

            } catch (error) {
                ;
            }
        };

        fetchProfile();

    }, [dispatch]);
}

export default useGetProfile;