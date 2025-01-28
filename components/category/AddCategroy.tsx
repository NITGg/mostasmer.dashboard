'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ErrorMsg from '../ErrorMsg';
import { LoadingIcon, PhotoIcon } from '../icons';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import { useAppDispatch } from '@/hooks/redux';
import { addCategory, updateCategory } from '@/redux/reducers/categoriesReducer';
import ImageApi from '../ImageApi';

const PopupCategory = ({ setOpen, category }: { setOpen: React.Dispatch<React.SetStateAction<boolean>>, category?: any }) => {
    const [categoryNames, setCategoryNames] = useState({ en: '', ar: '' });
    const [previewImage, setPreviewImage] = useState(category?.imageUrl || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            name: '',
            namear: '',
        }
    });

    const imageInputRef = useRef<HTMLInputElement>(null);
    const btnRef = useRef<any>();
    const t = useTranslations('category');
    const { token } = useAppContext();
    const dispatch = useAppDispatch();

    // Handle image selection
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                setIsImageLoading(true);
                setImageFile(file);
                const tempUrl = URL.createObjectURL(file);
                
                // Create a promise to handle image loading
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = tempUrl;
                    img.onload = resolve;
                    img.onerror = reject;
                });
                
                setPreviewImage(tempUrl);
            } catch (error) {
                console.error('Error loading image:', error);
                toast.error(t('error.image_load_failed'));
            } finally {
                setIsImageLoading(false);
            }
        }
    };

    // Handle image click to trigger file input
    const handleImageClick = () => {
        imageInputRef.current?.click();
    };

    const formatName = (nameEn: string, nameAr: string) => {
        let formattedName = '';
        if (nameAr) {
            formattedName += `{mlang ar}${nameAr.trim()}{mlang}`;
        }
        if (nameEn) {
            formattedName += `{mlang en}${nameEn.trim()}{mlang}`;
        }
        return formattedName;
    };

    // Fetch category names when editing
    useEffect(() => {
        if (category?.id) {
            fetchCategoryNames(category.id);
        }
    }, [category]);

    const fetchCategoryNames = async (categoryId: number) => {
        try {
            const [enResponse, arResponse] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${categoryId}?lang=en`),
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${categoryId}?lang=ar`)
            ]);

            const [enData, arData] = await Promise.all([
                enResponse.json(),
                arResponse.json()
            ]);

            setCategoryNames({
                en: enData.category.name,
                ar: arData.category.name
            });

            setValue('name', enData.category.name);
            setValue('namear', arData.category.name);
        } catch (error) {
            console.error('Error fetching category names:', error);
            toast.error('Failed to fetch category names');
        }
    };

    const onSubmit = handleSubmit(async (formData) => {
        try {
            if (!category && !previewImage) {
                toast.error(t('error.error_image_required'));
                return;
            }

            if (!formData.name.trim() && !formData.namear.trim()) {
                toast.error(t('error.error_name_required'));
                return;
            }

            setLoading(true);

            const submitFormData = new FormData();
            const formattedName = formatName(formData.name, formData.namear);
            submitFormData.append('name', formattedName);

            // Only append image if a new one was selected
            if (imageFile) {
                submitFormData.append('imageUrl', imageFile);
            }

            if (category?.id) {
                // Update existing category
                const { data } = await axios.put(
                    `/api/category/${category.id}`,
                    submitFormData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                dispatch(updateCategory(data.category));
                toast.success(t('success.update'));
            } else {
                // Create new category
                const { data } = await axios.post(
                    '/api/category',
                    submitFormData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                dispatch(addCategory(data.category));
                toast.success(t('success.add'));
            }

            setOpen(false);
            window.location.reload();
        } catch (error: any) {
            console.error('Submit Error:', error);
            toast.error(error?.response?.data?.message || t('error.general'));
        } finally {
            setLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <div className='space-y-5'>
                {/* Hidden file input */}
                <input
                    ref={imageInputRef}
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                />

                {/* Image preview/upload area */}
                <div className="relative h-72 sm:h-52 md:h-64 lg:h-72 xl:h-80">
                    <div 
                        onClick={handleImageClick}
                        className="cursor-pointer flex justify-center items-center rounded-lg overflow-hidden bg-slate-100"
                    >
                        {isImageLoading ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <LoadingIcon className="w-10 h-10 animate-spin text-teal-500" />
                                <span className="text-sm text-gray-500 mt-2">{t('loading')}</span>
                            </div>
                        ) : previewImage ? (
                            <div className="relative group h-72 sm:h-52 md:h-64 lg:h-72 xl:h-80 flex justify-center items-center">
                                <ImageApi
                                    src={previewImage}
                                    alt="Category"
                                    height={64}
                                    width={48}
                                    className="w-48 object-contain rounded-3xl"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-lg">
                                    <PhotoIcon className="size-10 text-white" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <PhotoIcon className="size-10 text-gray-400" />
                                <span className="text-sm text-gray-500 mt-2">{t('clickToUpload')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Name inputs */}
                <div>
                    <input
                        {...register('name')}
                        type="text"
                        className="border py-3 px-2 w-full outline-none rounded"
                        placeholder={t('placeholder_category_edit_en')}
                    />
                    <ErrorMsg message={errors?.name?.message as string} />
                </div>

                <div>
                    <input
                        {...register('namear')}
                        type="text"
                        className="border py-3 px-2 w-full outline-none rounded"
                        placeholder={t('placeholder_category_edit_ar')}
                    />
                    <ErrorMsg message={errors?.namear?.message as string} />
                </div>

                {/* Action buttons */}
                <div className="flex justify-center gap-4 mt-6">
                    <button 
                        type="submit"
                        disabled={loading}
                        className='w-[83px] h-[28px] flex items-center justify-center rounded-[15px] bg-[#2ab09c] text-white text-sm shadow-[0_2px_6px_-1px_rgba(0,0,0,0.5)] hover:bg-[#239b8c]'
                    >
                        {loading ? (
                            <LoadingIcon className='w-4 h-4 animate-spin' />
                        ) : (
                            category ? t('button_submit_edit') : t('button_submit_add')
                        )}
                    </button>
                    <button 
                        type="button"
                        onClick={() => setOpen(false)}
                        className='w-[83px] h-[28px] flex items-center justify-center rounded-[15px] bg-white border-2 border-[#2ab09c] text-[#2ab09c] text-sm shadow-[0_2px_6px_-1px_rgba(0,0,0,0.15)] hover:bg-gray-50'
                    >
                        {t('button_cancel')}
                    </button>

                </div>
            </div>
        </form>
    );
};

export default PopupCategory;