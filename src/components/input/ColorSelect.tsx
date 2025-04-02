'use client'

import { useCallback, useEffect, useState } from 'react'
import { ImageType } from '../manager/addst'
import SelectImage from './SelectImage'
import Button from '../ui/Button'

interface ColorSelectProps {
  item: ImageType
  addImageToState: (value: ImageType) => void
  RemoveImageFromState: (value: ImageType) => void
  isProductCreated: boolean
}

const ColorSelect: React.FC<ColorSelectProps> = ({
  item,
  addImageToState,
  RemoveImageFromState,
  isProductCreated,
}) => {
  const [isSelected, setIsSelected] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false)
      setFile(null)
    }
  }, [isProductCreated])

  const handleFileChange = useCallback(
    (value: File | null) => {
      setFile(value)
      addImageToState({ ...item, image: value })
    },
    [item, addImageToState]
  )

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSelected(e.target.checked)
      if (!e.target.checked) {
        setFile(null)
        RemoveImageFromState(item)
      }
    },
    [item, RemoveImageFromState]
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 overflow-y-auto border-b-[1.2px] border-slate-200 mb-2 p-2 gap-2 items-center">
      <div className="flex flex-row items-center gap-2">
        <input
          type="checkbox"
          id={item.color}
          value={item.color}
          checked={isSelected}
          onChange={handleCheck}
          className="cursor-pointer"
        />
        <label htmlFor={item.color} className="cursor-pointer">
          {item.color}
        </label>
      </div>

      {isSelected && (
        <div className="col-span-2 text-center">
          {!file ? (
            <SelectImage item={item} handleFileChange={handleFileChange} />
          ) : (
            <div className="flex flex-row items-center text-sm gap-2 col-span-2 justify-between ">
              <p className="text-[10px] text-gray-600">
                {file.name} - {file.size} bytes
              </p>
              <div className=" w-[60px] ">
                <Button
                  label="Cancel"
                  onClick={() => {
                    setFile(null)
                    RemoveImageFromState(item)
                  }}
                  disabled={isProductCreated}
                
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ColorSelect
