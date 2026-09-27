import styles from "@/app/scales/page.module.css";

export type ScaleType = "major" | "minor";
export type NumAccidentals = "upTo2" | "threeOrMore";

type SelectedTypes = Record<ScaleType, boolean>;
type SelectedAccidentals = Record<NumAccidentals, boolean>;


type ScaleFiltersProp = {
    selectedTypes: SelectedTypes;
    selectedAccidentals: SelectedAccidentals;
    onTypeChange: (type: ScaleType, checked: boolean) => void;
    onAccidentalChange: (accidentals: NumAccidentals, checked: boolean) => void;

    onSelectAll: (checked: boolean) => void;
}


export default function ScaleFilters({
    selectedTypes,
    selectedAccidentals,
    onTypeChange,
    onAccidentalChange,
    onSelectAll,
}: ScaleFiltersProp) {
    const allTypesSelected = selectedTypes.major && selectedTypes.minor;


    return (
        <div className={styles.scaleFilters}>
            <h2>Filters</h2>
            <div className={styles.filterGroups}>
                <div className={styles.filterGroup}>
                    <p className={styles.filterGroupLabel}>Modality</p>
                    <label className={styles.checkboxFilter} htmlFor="major-filter">
                        <input
                            id="major-filter"
                            type="checkbox"
                            checked={selectedTypes.major}
                            onChange={(event) => onTypeChange("major", event.target.checked)
                            }
                        />
                        Major
                    </label>

                    <label className={styles.checkboxFilter} htmlFor="minor-filter">
                        <input
                            id="minor-filter"
                            type="checkbox"
                            checked={selectedTypes.minor}
                            onChange={(event) => onTypeChange("minor", event.target.checked)
                            }
                        />
                        Minor
                    </label>

                    <label className={styles.checkboxFilter} htmlFor="select-all-filter">
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

                <div className={styles.filterGroup}>
                    <p className={styles.filterGroupLabel}>
                        Accidentals
                    </p>

                    <label className={styles.checkboxFilter} htmlFor="up-to-2-filter">
                        <input
                            id="up-to-2-filter"
                            type="checkbox"
                            checked={selectedAccidentals.upTo2}
                            onChange={(event) =>
                                onAccidentalChange("upTo2", event.target.checked)
                            }
                        />
                        0 - 2
                    </label>

                    <label className={styles.checkboxFilter} htmlFor="3-plus-filter">
                        <input
                            id="3-plus-filter"
                            type="checkbox"
                            checked={selectedAccidentals.threeOrMore}
                            onChange={(event) =>
                                onAccidentalChange("threeOrMore", event.target.checked)
                            }
                        />
                        3+
                    </label>
                </div>
            </div>
        </div>
    );
}