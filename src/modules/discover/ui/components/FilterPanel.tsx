import React, { useState } from 'react'
import { Search } from 'lucide-react'

type FilterPanelProps = {
    onSearch: (searchTerm: string) => void;
    onFilterChange: (filters: {
        location: string;
        discipline: string;
        styleTags: string[];
    }) => void;
    disciplines: string[];
    locations: string[];
    styleTags: string[];
}

export function FilterPanel({
    onSearch,
    onFilterChange,
    disciplines,
    locations,
    styleTags
}: FilterPanelProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDiscipline, setSelectedDiscipline] = useState('');
    const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleFilterChange = (type: 'location' | 'discipline' | 'styleTags', value: string) => {
        switch (type) {
            case 'location':
                setSelectedLocation(value);
                onFilterChange({
                    location: value,
                    discipline: selectedDiscipline,
                    styleTags: selectedStyleTags
                });
                break;
            case 'discipline':
                setSelectedDiscipline(value);
                onFilterChange({
                    location: selectedLocation,
                    discipline: value,
                    styleTags: selectedStyleTags
                });
                break;
            case 'styleTags':
                const updatedTags = selectedStyleTags.includes(value)
                    ? selectedStyleTags.filter(tag => tag !== value)
                    : [...selectedStyleTags, value];
                setSelectedStyleTags(updatedTags);
                onFilterChange({
                    location: selectedLocation,
                    discipline: selectedDiscipline,
                    styleTags: updatedTags
                });
                break;
        }
    };

    return (
        <div className="sticky top-0 bg-white shadow-md p-4 z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search Field */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, style, or location..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Location Dropdown */}
                    <div>
                        <select
                            value={selectedLocation}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Locations</option>
                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Discipline Dropdown */}
                    <div>
                        <select
                            value={selectedDiscipline}
                            onChange={(e) => handleFilterChange('discipline', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Disciplines</option>
                            {disciplines.map((discipline) => (
                                <option key={discipline} value={discipline}>
                                    {discipline}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Style Tags Dropdown */}
                    <div className="relative">
                        <select
                            value=""
                            onChange={(e) => handleFilterChange('styleTags', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Style Tags</option>
                            {styleTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>

                        {/* Selected Tags */}
                        {selectedStyleTags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedStyleTags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleFilterChange('styleTags', tag)}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 