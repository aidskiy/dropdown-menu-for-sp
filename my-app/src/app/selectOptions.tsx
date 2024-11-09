import { useEffect, useRef, useState } from "react"
import styles from "./select.module.css"
import { FiSearch } from "react-icons/fi"

// Define the structure for each selectable option, including an optional avatar image
export type SelectOption = {
    label: string
    value: string | number
    avatarImg?: string
}

// Props for multiple selection mode
type MultipleSelectProps = {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
}

// Props for single selection mode
type SingleSelectProps = {
    multiple?: false
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

// Union type for the component's props, supporting both single and multiple select modes
type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

// Main Select component
export function Select({ multiple, value, onChange, options }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false) // Controls dropdown visibility
    const [highlightedIndex, setHighlightedIndex] = useState(0) // Tracks which option is highlighted
    const containerRef = useRef<HTMLDivElement>(null) // Ref for container div for managing focus
    const [searchTerm, setSearchTerm] = useState(''); // State to hold search term input

    // Filter options based on the search term
    const filteredItems = options.filter((option) => {
        return option.label.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Clear all selected options (for multiple select) or reset to undefined (for single select)
    function clearOptions() {
        multiple ? onChange([]) : onChange(undefined)
    }

    // Handle option selection and toggle selection for multiple select mode
    function selectOption(option: SelectOption) {
        if (multiple) {
            if (value.includes(option)) {
                onChange(value.filter(o => o !== option))
            } else {
                onChange([...value, option])
            }
        } else {
            if (option !== value) onChange(option)
        }
    }

    // Check if an option is selected (for highlighting and checkbox display)
    function isOptionSelected(option: SelectOption) {
        return multiple ? value.includes(option) : option === value
    }

    // Reset highlighted index when dropdown is opened
    useEffect(() => {
        if (isOpen) setHighlightedIndex(0)
    }, [isOpen])

    // Keyboard navigation handling for dropdown
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return
            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen(prev => !prev)
                    if (isOpen) selectOption(options[highlightedIndex])
                    break
                case "ArrowUp":
                case "ArrowDown": {
                    if (!isOpen) {
                        setIsOpen(true)
                        break
                    }
                    const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue)
                    }
                    break
                }
                case "Escape":
                    setIsOpen(false)
                    break
            }
        }
        containerRef.current?.addEventListener("keydown", handler)

        // Cleanup event listener on unmount
        return () => {
            containerRef.current?.removeEventListener("keydown", handler)
        }
    }, [isOpen, highlightedIndex, options])

    return (
        <div
            ref={containerRef}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsOpen(false)
                }
            }}
            onClick={() => setIsOpen(prev => !prev)}
            tabIndex={0}
            className={styles.container}
        >
            {/* Display selected value(s) */}
            <span className={styles.value}>
                {multiple
                    ? value.map(v => (
                        <button
                            key={v.value}
                            onClick={e => {
                                e.stopPropagation()
                                selectOption(v)
                            }}
                            className={styles["option-badge"]}
                        >
                            {v.avatarImg && (
                                <img
                                    src={v.avatarImg}
                                    alt="A"
                                    className="w-6 h-6 rounded-full object-cover mr-1 inline-block"
                                />
                            )}
                            {v.label}
                            <span className={styles["remove-btn"]}>&times;</span>
                        </button>
                    ))
                    : value?.label}
            </span>
            {/* Button to clear selected options */}
            <button
                onClick={e => {
                    e.stopPropagation()
                    clearOptions()
                }}
                className={styles["clear-btn"]}
            >
                &times;
            </button>

            {/* Dropdown menu */}
            <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
                <FiSearch className="absolute left-2 top-3 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border-b-2 border-gray-300 ml-5"
                    onClick={e => {
                        e.stopPropagation()
                    }}
                />

                {/* Render filtered options */}
                {filteredItems.map((option, index) => (
                    <li
                        onClick={e => {
                            e.stopPropagation()
                            selectOption(option)
                            setIsOpen(false)
                        }}
                        key={option.value}
                        className={`${styles.option}`}
                    >
                        {option.avatarImg && (
                            <img
                                src={option.avatarImg}
                                alt={option.label}
                                className="w-6 h-6 rounded-full object-cover mr-1 inline-block"
                            />
                        )}
                        {option.label}
                        <input
                            className="accent-orange-500 h-6 w-6"
                            type="checkbox"
                            checked={isOptionSelected(option)}
                            onChange={() => selectOption(option)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}
