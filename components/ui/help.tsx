'use client'
import { Dialog, Transition, Disclosure } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { IoIosHelpCircleOutline } from "react-icons/io";



const items = [
  { title: 'Domanda 1', content: 'Risposta alla domanda 1' },
  { title: 'Domanda 2', content: 'Risposta alla domanda 2' },
  { title: 'Domanda 3', content: 'Risposta alla domanda 3' },
];


const Help = () => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <div>
    <button
    onClick={() => setIsOpen(true)}
    className="px-4 py-2 text-primary text-3xl rounded"
  >
    <IoIosHelpCircleOutline />
  </button>
  </div>
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Guida
              </Dialog.Title>

              <div className="mt-4 space-y-2">
{items.map((item, idx) => (
<Disclosure key={idx}>
{({ open }) => (
<>
<Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/75">
<span>{item.title}</span>
<ChevronUpIcon
  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
/>
</Disclosure.Button>
<Disclosure.Panel className="px-4 pt-2 pb-2 text-sm text-gray-500">
{item.content}
</Disclosure.Panel>
</>
)}
</Disclosure>
))}
</div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Chiudi
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
  </>
  )
}

export default Help