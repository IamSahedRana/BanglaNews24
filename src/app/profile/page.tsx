"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import React, { useState } from "react";

const ProfilePage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [show, setShow] = useState(false);

  // Fixed the event type from React.SubmitEvent to React.FormEvent<HTMLFormElement>
  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUserData = Object.fromEntries(formData.entries()) as { name: string; image: string };

    await authClient.updateUser({
      ...newUserData,
    });
  };

  const handleShowForm = () => {
    setShow(!show);
  };

  return (
    <div className="mt-5 ">
      <div className="flex flex-col items-center gap-2">
        <Link href={"/profile"}>
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
              {/* Changed <image> to standard HTML <img> */}
              <img
                alt="Tailwind-CSS-Avatar-component"
                src={user?.image || ""} 
              />
            </div>
          </div>
        </Link>

        <h2>{user?.name}</h2>
        <p>{user?.email}</p>

        <button onClick={handleShowForm} className="btn">
          Edit Profile
        </button>

        {show && (
          <form onSubmit={handleUpdateProfile}>
            <fieldset className="fieldset rounded-box w-md">
              <label className="label">নাম</label>
              <input
                name="name"
                type="text"
                className="input w-md"
                placeholder="Name"
                defaultValue={user?.name || ""}
              />

              <label className="label">ImageURL</label>
              <input
                name="image"
                type="url"
                className="input w-md"
                placeholder="Image"
                defaultValue={user?.image || ""}
              />

              <button type="submit" className="btn text-white bg-red-700 mt-4 ">
                Update Profile
              </button>
            </fieldset>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;