import axios from 'axios';
import { useLocale } from 'next-intl';
import React, { memo, useEffect, useState } from 'react'

const SpeciesSelect = memo(({ setValue, speciesId }: { setValue: any, speciesId: string }) => {
    const [species, setSpecies] = useState([] as any);
    const locale = useLocale()
    const fetchSpecies = async () => {
        try {
            const { data } = await axios.get(`/api/species?fields=id,name&lang=${locale}`)
            setSpecies(data.species)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchSpecies()
    }, [])

    return (
        <div>
            {
                species?.length ?
                    <select
                        className="border py-3 px-2 w-full outline-none"
                        defaultValue={speciesId}
                        onChange={(e) => {
                            setValue('speciesId', e.target.value)
                        }}
                    >
                        <option value='' key='selectPet'>Select Pet</option>
                        {
                            species.map((s: any,) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))
                        }
                    </select>
                    : ""
            }
        </div>
    )
}

)
SpeciesSelect.displayName = 'speciesselect'
export default SpeciesSelect