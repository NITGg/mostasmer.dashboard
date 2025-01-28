'use client'
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, } from "react";

const Pagination = ({ count, length, limit, setLimit }: {
    count: number,
    length: number,
    limit: number,
    setLimit: Dispatch<SetStateAction<number>>
}) => {

    const t = useTranslations('pagination')
    const locale = useLocale();

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const params = new URLSearchParams(searchParams);

    const skip = searchParams.get('skip') || 0
    const keyword = searchParams.get("keyword")

    const { push } = useRouter();

    const pushQuery = (key: string, term: string) => {
        if (term)
            params.set(key, term);
        else
            params.delete(key);
        push(`${pathname}?${params.toString()}`);
    }

    const nextPage = () => {
        if (length == limit) {
            pushQuery('skip', `${skip ? +limit + +skip : limit}`)
        }
    }

    const prevPage = () => {
        const skip = searchParams.get('skip');
        if (skip && +skip > 0) {
            const newSkip = +skip - limit;
            pushQuery('skip', `${newSkip < 0 ? 0 : newSkip}`);
        }
    }

    return (
        <div className="text-xs sm:text-base bg-gray-100 py-3 flex items-center justify-end gap-5 border-t-2">
            <div>
                <span className="">
                    {t('rowPerPage')}
                </span>
                <select
                    disabled={keyword ? true : false}
                    onChange={(e) => {
                        pushQuery('limit', e.target.value)
                        setLimit(e.target.value as any)
                    }}
                    className="ml-2 border rounded p-1">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <div className="flex gap-1">
                <div>
                    <span>
                        {+length}
                    </span>
                    <span>
                        -
                    </span>
                    <span>
                        {(+skip + length)}
                    </span>
                </div>
                <span>
                    {t('of')}
                </span>
                <span>
                    {count}
                </span>
            </div>
            <div className="flex gap-4">
                <button disabled={!(skip && +skip > 0)} onClick={() => prevPage()} >
                    <ChevronLeftIcon className={clsx(`size-5 text-gray-600 disabled:text-gray-300`,
                        { 'rotate-180': locale == 'ar' }
                    )} />
                </button>
                <button disabled={!(length == limit)} onClick={nextPage} >
                    <ChevronRightIcon className={clsx(`size-5 text-gray-600 disabled:text-gray-300`,
                        { 'rotate-180': locale == 'ar' }
                    )} />
                </button>
            </div>
        </div>
    )
}

export default Pagination;