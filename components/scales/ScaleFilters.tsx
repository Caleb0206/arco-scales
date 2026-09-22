import styles from "@/app/scales/page.module.css";

export type ScaleType = "major" | "minor";
export type Difficulty = "easy" | "hard";

type SelectedTypes = Record<ScaleType, boolean>;
type SelectedDifficulty = Record<Difficulty, boolean>;


type ScaleFiltersProp = {
    selectedTypes: SelectedTypes;
    selectedDifficulties: SelectedDifficulty;
    onTypeChange: (type: ScaleType, checked: boolean) => void;
    onDifficultyChange: (difficulty: Difficulty, checked: boolean) => void;

    onSelectAll: (checked: boolean) => void;
}


export default function ScaleFilters({
    selectedTypes,
    selectedDifficulties,
    onTypeChange,
    onDifficultyChange,
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
                    <p className={styles.filterGroupLabel}>Difficulty</p>


                    <label className={styles.checkboxFilter} htmlFor="easy-filter">
                        <input
                            id="easy-filter"
                            type="checkbox"
                            checked={selectedDifficulties.easy}
                            onChange={(event) =>
                                onDifficultyChange("easy", event.target.checked)
                            }
                        />
                        Easy
                    </label>

                    <label className={styles.checkboxFilter} htmlFor="hard-filter">
                        <input
                            id="hard-filter"
                            type="checkbox"
                            checked={selectedDifficulties.hard}
                            onChange={(event) =>
                                onDifficultyChange("hard", event.target.checked)
                            }
                        />
                        Hard
                    </label>
                </div>
            </div>


        </div>
    );
}