// // "use client";
// // import React, { useState } from "react";
// // import { InputField } from "@/components/uii/InputFields";
// // import { ImageUpload } from "@/components/uii/ImageUpload";
// // import { useTranslations } from "next-intl";
// // import { useAppContext } from "@/context/appContext";
// // import toast from "react-hot-toast";
// // import { useForm, Controller } from "react-hook-form";
// // import CustomDatePicker from "../CustomDatePicker";
// // import { Button } from "@/components/uii/Buttonn";

// // interface Brand {
// //     id?: number;
// //     name: string;
// //     url: string;
// //     phone: string;
// //     email: string;
// //     validFrom: string;
// //     validTo: string;
// //     logo?: string | File;
// //     cover?: string | File;
// // }

// // interface AddBrand2Props {
// //     onSubmit: (formData: FormData) => Promise<void>;
// //     onCancel: () => void;
// //     initialData?: Brand | null;
// //     isLoading?: boolean;
// // }

// // const AddBrand2: React.FC<AddBrand2Props> = ({ 
// //     onCancel, 
// //     initialData,
// // }) => {
// //     const t = useTranslations('brand');
// //     const { token } = useAppContext();
// //     const [loading, setLoading] = useState(false);
// //     const [formData, setFormData] = useState<Brand>({
// //         name: "",
// //         url: "",
// //         phone: "",
// //         email: "",
// //         validFrom: new Date().toISOString().split('T')[0],
// //         validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
// //     });

// //     const [logoFile, setLogoFile] = useState<File | null>(null);
// //     const [coverFile, setCoverFile] = useState<File | null>(null);

// //     const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<Brand>({
// //         defaultValues: {
// //             validFrom: new Date().toISOString().split('T')[0],
// //             validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
// //         }
// //     });

// //     // Watch the date fields to ensure they're populated
// //     const validFrom = watch('validFrom');
// //     const validTo = watch('validTo');

// //     const handleSubmitForm = async (data: Brand) => {
// //         if (!validFrom || !validTo) {
// //             toast.error(t('selectDates'));
// //             return;
// //         }
        
// //         // Update formData with the new dates
// //         setFormData({
// //             ...formData,
// //             validFrom: (data.validFrom as unknown as Date).toISOString().split('T')[0],
// //             validTo: (data.validTo as unknown as Date).toISOString().split('T')[0],
// //         });
        
// //         // Call the original handleSubmit function
// //         await handleSubmitFormData();
// //     };

// //     const handleSubmitFormData = async () => {
// //         if (loading) return;
        
// //         try {
// //             setLoading(true);
// //             const formDataToSubmit = new FormData();
            
// //             // Append required fields
// //             formDataToSubmit.append('name', formData.name.trim());
// //             formDataToSubmit.append('phone', formData.phone.trim());
// //             formDataToSubmit.append('email', formData.email.trim());
// //             formDataToSubmit.append('url', formData.url.trim());
// //             formDataToSubmit.append('validFrom', formData.validFrom);
// //             formDataToSubmit.append('validTo', formData.validTo);

// //             // Append files if they exist
// //             if (logoFile) {
// //                 formDataToSubmit.append('logo', logoFile);
// //             }
// //             if (coverFile) {
// //                 formDataToSubmit.append('cover', coverFile);
// //             }

// //             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`, {
// //                 method: 'POST',
// //                 headers: {
// //                     'Authorization': `Bearer ${token}`
// //                 },
// //                 body: formDataToSubmit
// //             });

// //             const data = await response.json();

// //             if (!response.ok) {
// //                 // Handle specific unique constraint errors
// //                 if (data.error?.includes('Brand_name_key')) {
// //                     throw new Error(t('brandNameExists'));
// //                 }
// //                 if (data.error?.includes('Brand_phone_key')) {
// //                     throw new Error(t('phoneExists'));
// //                 }
// //                 if (data.error?.includes('Brand_email_key')) {
// //                     throw new Error(t('emailExists'));
// //                 }
// //                 throw new Error(data.message || t('addFailed'));
// //             }

// //             // Create social media for the brand
// //             try {
// //                 const socialMediaResponse = await fetch(
// //                     `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/social-media/${data.brand.id}`,
// //                     {
// //                         method: 'PUT',
// //                         headers: {
// //                             'Authorization': `Bearer ${token}`,
// //                             'Content-Type': 'application/json'
// //                         },
// //                         body: JSON.stringify({
// //                             facebook: null,
// //                             twitter: null,
// //                             instagram: null,
// //                             linkedin: null,
// //                             tiktok: null,
// //                             youtube: null,
// //                             pinterest: null,
// //                             snapchat: null,
// //                             whatsapp: null,
// //                             telegram: null,
// //                             reddit: null
// //                         })
// //                     }
// //                 );

// //                 if (!socialMediaResponse.ok) {
// //                     console.error('Failed to create social media:', await socialMediaResponse.text());
// //                 }
// //             } catch (socialMediaError) {
// //                 console.error('Error creating social media:', socialMediaError);
// //             }

// //             toast.success(t('successAdd'));
// //             onCancel();
// //         } catch (error: unknown) {
// //             console.error(t('addFailedbrand'), error);
// //             toast.error(error instanceof Error ? error.message : t('addFailed'));
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //       <><h3 className="-mt-12 font-bold ml-5 p-3 text-2xl">{initialData ? t('editBrand') : t('addBrand2')}</h3>
      
      
// //       <div className="bg-white h-[354px] md:text-xl ml-5 p-6 rounded-[25px] shadow-[0px_4px_10px_-4px_rgba(0,0,0,0.25)] top-[95px] w-11/12">
// //         {/* <h3 className="text-2xl font-bold mb-6">{initialData ? t('editBrand') : t('addBrand')}</h3> */}

// //         <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-[1fr_2fr] gap-x-14">
// //           <div className="flex flex-col gap-4">
// //             <InputField
// //               label={t('addname')}
// //               value={formData.name}
// //               onChange={(value) => setFormData({ ...formData, name: value })} />
// //             <InputField
// //               label={t('addurl')}
// //               value={formData.url}
// //               onChange={(value) => setFormData({ ...formData, url: value })} />
// //             <InputField
// //               label={t('addphone')}
// //               value={formData.phone}
// //               onChange={(value) => setFormData({ ...formData, phone: value })}
// //               type="tel" />
// //             <InputField
// //               label={t('addemail')}
// //               value={formData.email}
// //               onChange={(value) => setFormData({ ...formData, email: value })}
// //               type="email" />
// //           </div>

// //           <div className="flex flex-col gap-5">
// //             <div className="flex gap-5 text-black">
// //               <ImageUpload
// //                 label={t('brandLogo')}
// //                 onChange={(file) => setLogoFile(file)}
// //                 preview={typeof formData.logo === 'string' ? formData.logo : undefined} />
// //               <ImageUpload
// //                 label={t('brandCover')}
// //                 onChange={(file) => setCoverFile(file)}
// //                 preview={typeof formData.cover === 'string' ? formData.cover : undefined}
// //                  />
// //             </div>

// //             <div className="flex gap-4">
// //               <Controller
// //                 name="validFrom"
// //                 control={control}
// //                 defaultValue={formData.validFrom}
// //                 render={({ field }) => (
// //                   <CustomDatePicker
// //                     label={t('validFrom')}
// //                     fieldForm="validFrom"
// //                     control={control}
// //                     setValue={setValue}
// //                     errors={errors}
// //                     defaultValue={field.value as unknown as Date}
// //                     className="border rounded-md " />
// //                   )} />


// //                 <Controller
// //                   name="validTo"
// //                   control={control}
// //                   defaultValue={formData.validTo}
// //                   render={({ field }) => (
// //                     <CustomDatePicker
// //                       label={t('validTo')}
// //                       fieldForm="validTo"
// //                       control={control}
// //                       setValue={setValue}
// //                       errors={errors}
// //                       defaultValue={field.value as unknown as Date}
// //                       className="border rounded-2xl border-gray-200/80 " />
// //                   )} />
// //             </div>

// //             <div className="gap-10 grid grid-cols-2 m-auto md:gap-6 mr-1 mt-8 text-red-500">
// //               <Button type="submit">
// //                 {loading ? t('loading') : initialData ? t('updateBrand') : t('addBrand')}
// //               </Button>
// //               <Button
// //                 variant="red2"
// //                 onClick={onCancel}
// //               >
// //                 {t('cancel')}
// //               </Button>


// //             </div>
// //           </div>
// //         </form>
// //       </div>
                  
// //       </>
// //     );
// // };

// // export default AddBrand2;

// "use client";
// import React, { useState } from "react";
// import { InputField } from "@/components/uii/InputFields";
// import { ImageUpload } from "@/components/uii/ImageUpload";
// import { useTranslations } from "next-intl";
// import { useAppContext } from "@/context/appContext";
// import toast from "react-hot-toast";
// import { useForm, Controller } from "react-hook-form";
// import CustomDatePicker from "../CustomDatePicker";
// import { Button } from "@/components/uii/Buttonn";

// interface Brand {
//     id?: number;
//     name: string;
//     url: string;
//     phone: string;
//     email: string;
//     validFrom: string;
//     validTo: string;
//     logo?: string | File;
//     cover?: string | File;
// }

// interface AddBrand2Props {
//     onSubmit: (formData: FormData) => Promise<void>;
//     onCancel: () => void;
//     initialData?: Brand | null;
//     isLoading?: boolean;
// }

// const AddBrand2: React.FC<AddBrand2Props> = ({ 
//     onCancel, 
//     initialData,
// }) => {
//     const t = useTranslations('brand');
//     const { token } = useAppContext();
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState<Brand>({
//         name: "",
//         url: "",
//         phone: "",
//         email: "",
//         validFrom: "",
//         validTo: "",
//     });

//     const [logoFile, setLogoFile] = useState<File | null>(null);
//     const [coverFile, setCoverFile] = useState<File | null>(null);
//     const [showTooltip, setShowTooltip] = useState(false);

//     const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<Brand>({
//         defaultValues: {
//             name: "",
//             url: "",
//             phone: "",
//             email: "",
//             validFrom: "",
//             validTo: ""
//         }
//     });

//     // Watch the date fields to ensure they're populated
//     const validFrom = watch('validFrom');
//     const validTo = watch('validTo');

//     const handleSubmitForm = async (data: Brand) => {
//         // Validate required fields
//         if (!formData.name.trim()) {
//             toast.error(t('nameRequired'));
//             return;
//         }
//         if (!formData.url.trim()) {
//             toast.error(t('urlRequired'));
//             return;
//         }
//         if (!formData.phone.trim()) {
//             toast.error(t('phoneRequired'));
//             return;
//         }
//         if (!validFrom || !validTo) {
//             toast.error(t('selectDates'));
//             return;
//         }
        
//         // Update formData with the new dates
//         setFormData({
//             ...formData,
//             validFrom: (data.validFrom as unknown as Date).toISOString().split('T')[0],
//             validTo: (data.validTo as unknown as Date).toISOString().split('T')[0],
//         });
        
//         // Call the original handleSubmit function
//         await handleSubmitFormData();
//     };

//     const handleSubmitFormData = async () => {
//         if (loading) return;
        
//         try {
//             setLoading(true);
//             const formDataToSubmit = new FormData();
            
//             // Append required fields
//             formDataToSubmit.append('name', formData.name.trim());
//             formDataToSubmit.append('phone', formData.phone.trim());
//             formDataToSubmit.append('email', formData.email.trim());
//             formDataToSubmit.append('url', formData.url.trim());
//             formDataToSubmit.append('validFrom', formData.validFrom);
//             formDataToSubmit.append('validTo', formData.validTo);

//             // Append files if they exist
//             if (logoFile) {
//                 formDataToSubmit.append('logo', logoFile);
//             }
//             if (coverFile) {
//                 formDataToSubmit.append('cover', coverFile);
//             }

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: formDataToSubmit
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 // Handle specific unique constraint errors
//                 if (data.error?.includes('Brand_name_key')) {
//                     throw new Error(t('brandNameExists'));
//                 }
//                 if (data.error?.includes('Brand_phone_key')) {
//                     throw new Error(t('phoneExists'));
//                 }
//                 if (data.error?.includes('Brand_email_key')) {
//                     throw new Error(t('emailExists'));
//                 }
//                 throw new Error(data.message || t('addFailed'));
//             }

//             // Create social media for the brand
//             try {
//                 const socialMediaResponse = await fetch(
//                     `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/social-media/${data.brand.id}`,
//                     {
//                         method: 'PUT',
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify({
//                             facebook: null,
//                             twitter: null,
//                             instagram: null,
//                             linkedin: null,
//                             tiktok: null,
//                             youtube: null,
//                             pinterest: null,
//                             snapchat: null,
//                             whatsapp: null,
//                             telegram: null,
//                             reddit: null
//                         })
//                     }
//                 );

//                 if (!socialMediaResponse.ok) {
//                     console.error('Failed to create social media:', await socialMediaResponse.text());
//                 }
//             } catch (socialMediaError) {
//                 console.error('Error creating social media:', socialMediaError);
//             }

//             toast.success(t('successAdd'));
//             onCancel();
//         } catch (error: unknown) {
//             console.error(t('addFailedbrand'), error);
//             toast.error(error instanceof Error ? error.message : t('addFailed'));
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//       <><h3 className="-mt-12 font-bold ml-5 p-3 text-2xl">{initialData ? t('editBrand') : t('addBrand2')}</h3>
      
      
//       <div className="bg-white h-[354px] md:text-xl ml-5 p-6 rounded-[25px] shadow-[0px_4px_10px_-4px_rgba(0,0,0,0.25)] top-[95px] w-11/12">
//         {/* <h3 className="text-2xl font-bold mb-6">{initialData ? t('editBrand') : t('addBrand')}</h3> */}

//         <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-[1fr_2fr] gap-x-14">
//           <div className="flex flex-col gap-4">
//             <div className="relative group">
//               <InputField
//                 label={t('addname')}
//                 value={formData.name}
//                 onChange={(value) => setFormData({ ...formData, name: value })} />
//               {!formData.name.trim() && showTooltip && (
//                 <span className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
//                   {t('nameRequired')}
//                 </span>
//               )}
//             </div>
//             <div className="relative group">
//               <InputField
//                 label={t('addurl')}
//                 value={formData.url}
//                 onChange={(value) => setFormData({ ...formData, url: value })} />
//               {!formData.url.trim() && showTooltip && (
//                 <span className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
//                   {t('urlRequired')}
//                 </span>
//               )}
//             </div>
//             <div className="relative group">
//               <InputField
//                 label={t('addphone')}
//                 value={formData.phone}
//                 onChange={(value) => setFormData({ ...formData, phone: value })}
//                 type="tel" />
//               {!formData.phone.trim() && showTooltip && (
//                 <span className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
//                   {t('phoneRequired')}
//                 </span>
//               )}
//             </div>
//             <InputField
//               label={t('addemail')}
//               value={formData.email}
//               onChange={(value) => setFormData({ ...formData, email: value })}
//               type="email" />
//           </div>

//           <div className="flex flex-col gap-5">
//             <div className="flex gap-5 text-black">
//               <ImageUpload
//                 label={t('brandLogo')}
//                 onChange={(file) => setLogoFile(file)}
//                 preview={typeof formData.logo === 'string' ? formData.logo : undefined} />
//               <ImageUpload
//                 label={t('brandCover')}
//                 onChange={(file) => setCoverFile(file)}
//                 preview={typeof formData.cover === 'string' ? formData.cover : undefined}
//                  />
//             </div>

//             <div className="flex gap-4">
//               <div className="relative group">
//                 <Controller
//                   name="validFrom"
//                   control={control}
//                   defaultValue={formData.validFrom}
//                   render={({ field }) => (
//                     <CustomDatePicker
//                       label={t('validFrom')}
//                       fieldForm="validFrom"
//                       control={control}
//                       setValue={setValue}
//                       errors={errors}
//                       defaultValue={field.value as unknown as Date}
//                       className="border rounded-md " />
//                   )} />
//                 {!validFrom && showTooltip && (
//                   <span className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
//                     {t('validFromRequired')}
//                   </span>
//                 )}
//               </div>

//               <div className="relative group">
//                 <Controller
//                   name="validTo"
//                   control={control}
//                   defaultValue={formData.validTo}
//                   render={({ field }) => (
//                     <CustomDatePicker
//                       label={t('validTo')}
//                       fieldForm="validTo"
//                       control={control}
//                       setValue={setValue}
//                       errors={errors}
//                       defaultValue={field.value as unknown as Date}
//                       className="border rounded-2xl border-gray-200/80 " />
//                   )} />
//                 {!validTo && showTooltip && (
//                   <span className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
//                     {t('validToRequired')}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="gap-10 grid grid-cols-2 m-auto md:gap-6 mr-1 mt-8 text-red-500">
//               <Button 
//                 type="submit"
//                 onClick={() => setShowTooltip(true)}
//               >
//                 {loading ? t('loading') : initialData ? t('updateBrand') : t('addBrand')}
//               </Button>
//               <Button
//                 variant="red2"
//                 onClick={onCancel}
//               >
//                 {t('cancel')}
//               </Button>


//             </div>
//           </div>
//         </form>
//       </div>
                  
//       </>
//     );
// };

// export default AddBrand2;


"use client";
import React, { useState } from "react";
import { InputField } from "@/components/uii/InputFields";
import { ImageUpload } from "@/components/uii/ImageUpload";
import { useTranslations } from "next-intl";
import { useAppContext } from "@/context/appContext";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import CustomDatePicker from "../CustomDatePicker";
import { Button } from "@/components/uii/Buttonn";

interface Brand {
    id?: number;
    name: string;
    url: string;
    phone: string;
    email: string;
    validFrom: string;
    validTo: string;
    logo?: string | File;
    cover?: string | File;
}

interface AddBrand2Props {
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    initialData?: Brand | null;
    isLoading?: boolean;
}

const AddBrand2: React.FC<AddBrand2Props> = ({ 
    onCancel, 
    initialData,
}) => {
    const t = useTranslations('brand');
    const { token } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Brand>({
        name: "",
        url: "",
        phone: "",
        email: "",
        validFrom: "",
        validTo: "",
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<Brand>({
        defaultValues: {
            name: "",
            url: "",
            phone: "",
            email: "",
            validFrom: "",
            validTo: ""
        }
    });

    // Watch the date fields to ensure they're populated
    const validFrom = watch('validFrom');
    const validTo = watch('validTo');

    const handleSubmitForm = async (data: Brand) => {
        // Validate required fields
        if (!formData.name.trim()) {
            toast.error(t('nameRequired'));
            return;
        }
        if (!formData.url.trim()) {
            toast.error(t('urlRequired'));
            return;
        }
        if (!formData.phone.trim()) {
            toast.error(t('phoneRequired'));
            return;
        }
        if (!validFrom || !validTo) {
            toast.error(t('selectDates'));
            return;
        }
        
        // Update formData with the new dates
        setFormData({
            ...formData,
            validFrom: (data.validFrom as unknown as Date).toISOString().split('T')[0],
            validTo: (data.validTo as unknown as Date).toISOString().split('T')[0],
        });
        
        // Call the original handleSubmit function
        await handleSubmitFormData();
    };

    const handleSubmitFormData = async () => {
        if (loading) return;
        
        try {
            setLoading(true);
            const formDataToSubmit = new FormData();
            
            // Append required fields
            formDataToSubmit.append('name', formData.name.trim());
            formDataToSubmit.append('phone', formData.phone.trim());
            formDataToSubmit.append('email', formData.email.trim());
            formDataToSubmit.append('url', formData.url.trim());
            formDataToSubmit.append('validFrom', formData.validFrom);
            formDataToSubmit.append('validTo', formData.validTo);

            // Append files if they exist
            if (logoFile) {
                formDataToSubmit.append('logo', logoFile);
            }
            if (coverFile) {
                formDataToSubmit.append('cover', coverFile);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brand`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSubmit
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle specific unique constraint errors
                if (data.error?.includes('Brand_name_key')) {
                    throw new Error(t('brandNameExists'));
                }
                if (data.error?.includes('Brand_phone_key')) {
                    throw new Error(t('phoneExists'));
                }
                if (data.error?.includes('Brand_email_key')) {
                    throw new Error(t('emailExists'));
                }
                throw new Error(data.message || t('addFailed'));
            }

            // Create social media for the brand
            try {
                const socialMediaResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/social-media/${data.brand.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            facebook: null,
                            twitter: null,
                            instagram: null,
                            linkedin: null,
                            tiktok: null,
                            youtube: null,
                            pinterest: null,
                            snapchat: null,
                            whatsapp: null,
                            telegram: null,
                            reddit: null
                        })
                    }
                );

                if (!socialMediaResponse.ok) {
                    console.error('Failed to create social media:', await socialMediaResponse.text());
                }
            } catch (socialMediaError) {
                console.error('Error creating social media:', socialMediaError);
            }

            toast.success(t('successAdd'));
            onCancel();
        } catch (error: unknown) {
            console.error(t('addFailedbrand'), error);
            toast.error(error instanceof Error ? error.message : t('addFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
      <><h3 className="-mt-12 font-bold ml-5 p-3 text-2xl">{initialData ? t('editBrand') : t('addBrand2')}</h3>
      
      
      <div className="bg-white h-[354px] md:text-xl ml-5 p-6 rounded-[25px] shadow-[0px_4px_10px_-4px_rgba(0,0,0,0.25)] top-[95px] w-11/12">
        {/* <h3 className="text-2xl font-bold mb-6">{initialData ? t('editBrand') : t('addBrand')}</h3> */}

        <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-[1fr_2fr] gap-x-14">
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <InputField
                label={t('addname')}
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })} />
              {!formData.name.trim() && showTooltip && (
                <span className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
                  {t('nameRequired')}
                </span>
              )}
            </div>
            <div className="relative group">
              <InputField
                label={t('addurl')}
                value={formData.url}
                onChange={(value) => setFormData({ ...formData, url: value })} />
              {!formData.url.trim() && showTooltip && (
                <span className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
                  {t('urlRequired')}
                </span>
              )}
            </div>
            <div className="relative group">
              <InputField
                label={t('addphone')}
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                type="tel" />
              {!formData.phone.trim() && showTooltip && (
                <span className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
                  {t('phoneRequired')}
                </span>
              )}
            </div>
            <InputField
              label={t('addemail')}
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              type="email" />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex gap-5 text-black">
              <ImageUpload
                label={t('brandLogo')}
                onChange={(file) => setLogoFile(file)}
                preview={typeof formData.logo === 'string' ? formData.logo : undefined} />
              <ImageUpload
                label={t('brandCover')}
                onChange={(file) => setCoverFile(file)}
                preview={typeof formData.cover === 'string' ? formData.cover : undefined}
                 />
            </div>

            <div className="flex gap-4">
              <div className="relative group">
                <Controller
                  name="validFrom"
                  control={control}
                  defaultValue={formData.validFrom}
                  render={({ field }) => (
                    <CustomDatePicker
                      label={t('validFrom')}
                      fieldForm="validFrom"
                      control={control}
                      setValue={setValue}
                      errors={errors}
                      defaultValue={field.value as unknown as Date}
                      className="border rounded-md " />
                  )} />
                {!validFrom && showTooltip && (
                  <span className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
                    {t('validFromRequired')}
                  </span>
                )}
              </div>

              <div className="relative group">
                <Controller
                  name="validTo"
                  control={control}
                  defaultValue={formData.validTo}
                  render={({ field }) => (
                    <CustomDatePicker
                      label={t('validTo')}
                      fieldForm="validTo"
                      control={control}
                      setValue={setValue}
                      errors={errors}
                      defaultValue={field.value as unknown as Date}
                      className="border rounded-2xl border-gray-200/80 " />
                  )} />
                {!validTo && showTooltip && (
                  <span className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
                    {t('validToRequired')}
                  </span>
                )}
              </div>
            </div>

            <div className="gap-10 grid grid-cols-2 m-auto md:gap-6 mr-1 mt-8 text-red-500">
              <Button 
                type="submit"
                onClick={() => setShowTooltip(true)}
              >
                {loading ? t('loading') : initialData ? t('updateBrand') : t('addBrand')}
              </Button>
              <Button
                variant="red2"
                onClick={onCancel}
              >
                {t('cancel')}
              </Button>


            </div>
          </div>
        </form>
      </div>
                  
      </>
    );
};

export default AddBrand2;
