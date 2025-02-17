import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { Badge } from "@/redux/reducers/badgesReducer";
interface BadgesSwiperProps {
  badges: Badge[];
  setUpdateBadge: (badge: Badge) => void;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const BadgesSwiper: React.FC<BadgesSwiperProps> = ({
  badges,
  setUpdateBadge,
  setOpenForm,
}) => {
  return (
    <>
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={15}
        slidesPerView="auto"
        // slidesPerView={2}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        // className="!px-4"
      >
        {badges.map((badge: Badge) => (
          <SwiperSlide key={badge.id} className="!w-auto flex justify-center">
            <div
              key={badge.id}
              className="bg-[#F0F2F5] relative hover:scale-95 focus-within:scale-95 transition-transform shadow-[0px_4px_10px_-4px_#00000040] w-48 h-44 rounded-2xl flex flex-col"
            >
              <div className="h-2/3 w-full p-2 relative rounded-t-2xl overflow-hidden flex flex-col justify-end text-white">
                <Image
                  src={badge.cover}
                  alt={badge.name}
                  quality={100}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <h1 className="capitalize text-xl font-bold z-10">
                  {badge.name}
                </h1>
                <h3 className="capitalize text-lg font-bold z-10">
                  total purchase
                </h3>
                <p className="text-lg z-10">{badge.minAmount} SR</p>
              </div>
              <div className="h-1/3 px-2 flex justify-between items-center">
                <span className="capitalize text-lg font-bold">points</span>
                <span className="text-lg font-bold">{badge.points}%</span>
              </div>
              <button
                className="absolute rounded-2xl inset-0 z-10"
                type="button"
                onClick={() => {
                  setUpdateBadge(badge);
                  setOpenForm(true);
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default BadgesSwiper;
