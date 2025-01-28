import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';

let cachedCategories: any[] | null = null;

const CategorySelect = memo(({ setValue, categoryId }: { setValue: any, categoryId?: any }) => {
    const [cate, setCate] = useState(cachedCategories || []);
    const fetchCate = async () => {
        try {
            if (cachedCategories) {
                return;
            }
            const { data } = await axios.get("/api/categories?fields=name,id&lang=en");
            setCate(data.categories);
            cachedCategories = data.categories;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCate();
    }, []);

    return (
        <div>
            {
                cate.length ?
                    <select
                        className="border py-3 px-2 w-full outline-none"
                        onChange={(e) => setValue('categoryId', e.target.value)}
                        defaultValue={categoryId}
                    >
                        <option value="">Select Category</option>
                        {cate.map((category: any) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    : ""
            }
        </div>
    );
}
);

CategorySelect.displayName = 'cateselect';
export default CategorySelect;
