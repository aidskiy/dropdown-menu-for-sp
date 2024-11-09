"use client"
import { useState } from "react"
import { Select, SelectOption } from "./selectOptions"


const options = [
  { label: "Marj", value: 1, avatarImg: 'photos/marj.jpg' },
  { label: "Bart", value: 2, avatarImg: 'photos/bart.jpg' },
  { label: "Lisa", value: 3, avatarImg: 'photos/lisa.jpg' },
  { label: "Maggie", value: 4, avatarImg: 'photos/maggie.jpg' },
  { label: "Homer", value: 5, avatarImg: 'photos/homer.jpg' },
];


function App() {
  const [value1, setValue1] = useState<SelectOption[]>([options[0]])

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1 className="text-1xl mb-2 font-bold">Select Users</h1>
        <Select
          multiple
          options={options}
          value={value1}
          onChange={o => setValue1(o)}
        />
      </div>
    </div>
  )
}

export default App