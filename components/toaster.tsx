"use client";

import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** 全局 Toast 容器 —— 挂载于根布局，react-toastify + NoteHub 主题定制（见 globals.css .nf-toast） */
export function Toaster() {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={2600}
      hideProgressBar
      closeButton={false}
      closeOnClick
      pauseOnHover={false}
      draggable={false}
      transition={Slide}
      theme="dark"
    />
  );
}
