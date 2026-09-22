export type ScaleType = "major" | "minor";

type SelectedTypes = Record<ScaleType, boolean>;

type ScaleFiltersProp = {
    selectedTypes: SelectedTypes;
    onTypeChange: (type: ScaleType, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
}


export default function ScaleFilters({
    selectedTypes,
    onTypeChange,
    onSelectAll,
}: ScaleFiltersProp) {
    const allTypesSelected = selectedTypes.major && selectedTypes.minor;


    return (
        <div className="scale-filters">
            <h2>Filters</h2>
            <p className="filter-group-label">Scale type</p>
            <label className="checkbox-filter" htmlFor="major-filter">
                <input
                    id="major-filter"
                    type="checkbox"
                    checked={selectedTypes.major}
                    onChange={(event) => onTypeChange("major", event.target.checked)
                    }
                />
                Major
            </label>

            <label className="checkbox-filter" htmlFor="minor-filter">
                <input
                    id="minor-filter"
                    type="checkbox"
                    checked={selectedTypes.minor}
                    onChange={(event) => onTypeChange("minor", event.target.checked)
                    }
                />
                Minor
            </label>

            <label className="checkbox-filter" htmlFor="select-all-filter">
                <input
                    id="select-all-filter"
                    type="checkbox"
                    checked={allTypesSelected}
                    onChange={(event) => onSelectAll(event.target.checked)
                    }
                />
                Select All
            </label>

        </div>
    );
}