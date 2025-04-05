<template>
    <svg
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        :width="size"
        viewBox="0 0 24 24"
        :height="size"
        fill="none"
    >
        <path
            fill="currentColor"
            d="M13.6468 10.4686L20.9321 2H19.2057L12.8799 9.3532L7.82741 2H2L9.6403 13.1193L2 22H3.72649L10.4068 14.2348L15.7425 22H21.5699L13.6468 10.4686ZM11.2821 13.2173L10.508 12.1101L4.34857 3.29968H7.00037L11.9711 10.4099L12.7452 11.5172L19.2066 20.7594H16.5548L11.2821 13.2173Z"
        ></path>
    </svg>
</template>

<script>
export default {
    props: {
        size: {
            type: Number,
            default: 24 // デフォルトのサイズ
        }
    }
};
</script>
