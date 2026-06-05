import React from "react";
import {Dialog} from '@headlessui/react'

export default function AdminDialog({title, isOpen, setIsOpen, children, disabled关闭=false}) {
  return (<Dialog
    className="relative z-50"
    open={isOpen}
    on关闭={() => {/*Empty function disables ESC to dismiss & click outside to dismiss*/}}
  >
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="w-full sm:max-w-lg lg:max-w-xl max-h-full rounded-sm bg-white p-4">
        <div className="flex justify-end border-b mb-2 pb-2">
          <div className="flex-1 font-semibold text-helper-color">{title}</div>
          <div className="flex-none">
            <button
              onClick={() => setIsOpen(false)}
              disabled={disabled关闭}
              className="text-sm hover:opacity-50"
            >
              <span className="lh-icon-x-mark text-lg"/> 关闭
            </button>
          </div>
        </div>
        {children}
      </Dialog.Panel>
    </div>
  </Dialog>);
}
