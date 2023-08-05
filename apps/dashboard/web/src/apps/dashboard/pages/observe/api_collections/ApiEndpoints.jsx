import PageWithMultipleCards from "../../../components/layouts/PageWithMultipleCards"
import { Tooltip, Text, HorizontalStack, Button, ButtonGroup } from "@shopify/polaris"
import api from "../api"
import { useEffect, useState } from "react"
import func from "@/util/func"
import GithubSimpleTable from "../../../components/tables/GithubSimpleTable";
import { useParams } from "react-router-dom"
import { saveAs } from 'file-saver'
import {
    ClockMinor,
    LockMinor,
    CircleAlertMajor,
    GlobeMinor,
    HintMajor,
    RedoMajor,
    ImportMinor
} from '@shopify/polaris-icons';

import "./api_inventory.css"
import ApiDetails from "./ApiDetails"
import Store from "../../../store"
import UploadFile from "../../../components/shared/UploadFile"
import RunTest from "./RunTest"
import ObserveStore from "../observeStore"

const StyledEndpoint = (data) => {
    const { method, url } = func.toMethodUrlObject(data)
    const arr = url.split("/")
    let colored = []
    arr.forEach((item, index) => {
        if (item.startsWith("{param")) {
            colored.push(index);
        }
    })

    function getMethodColor(method) {
        switch (method) {
            case "GET": return "success";
            case "POST": return "critical"
            default: return "";
        }
    }
    return (
        <Tooltip hoverDelay={800} content={data} width='wide' preferredPosition='mostSpace'>
            <HorizontalStack gap={"1"} wrap={false}>
                <Text as="span" variant="headingMd" color={getMethodColor(method)}>
                    {method}
                </Text>
                {/* <div style={{ marginBottom: "auto" }} className='rowIconClass'>
                    <Box padding="05">
                        <Icon source={iconFunc(method)}/>
                    </Box>
                </div> */}
                <div className="styled-endpoint">
                    {
                        arr?.map((item, index) => {
                            return (
                                <Text key={index} as="span" variant="headingMd" color={colored.includes(index) ? "critical" : ""}>
                                    {item + "/"}
                                </Text>
                            )
                        })
                    }
                </div>
            </HorizontalStack>
        </Tooltip>
    )
}

const headers = [
    {
        text: "Method",
        value: "method",
        showFilter: true
    },
    {
        text: "Endpoint",
        value: "parameterisedEndpoint",
        itemOrder: 1,
        showFilter: true,
        component: StyledEndpoint
    },
    {
        text: 'Tags',
        value: 'tags',
        itemCell: 3,
        showFilter: true
    },
    {
        text: 'Sensitive Params',
        value: 'sensitiveTags',
        itemOrder: 2,
        showFilter: true
    },
    {
        text: 'Last Seen',
        value: 'last_seen',
        icon: HintMajor,
        itemOrder: 3
    },
    {
        text: 'Access Type',
        value: 'access_type',
        icon: GlobeMinor,
        itemOrder: 3,
        showFilter: true
    },
    {
        text: 'Auth Type',
        value: 'auth_type',
        icon: LockMinor,
        itemOrder: 3,
        showFilter: true
    },
    {
        text: "Discovered",
        value: 'added',
        icon: ClockMinor,
        itemOrder: 3
    },
    {
        text: 'Changes',
        value: 'changes',
        icon: CircleAlertMajor,
        itemOrder: 3

    }
]

const sortOptions = [
    { label: 'Method', value: 'method asc', directionLabel: 'A-Z', sortKey: 'method' },
    { label: 'Method', value: 'method desc', directionLabel: 'Z-A', sortKey: 'method' },
    { label: 'Endpoint', value: 'endpoint asc', directionLabel: 'A-Z', sortKey: 'endpoint' },
    { label: 'Endpoint', value: 'endpoint desc', directionLabel: 'Z-A', sortKey: 'endpoint' },
    { label: 'Auth Type', value: 'auth_type asc', directionLabel: 'A-Z', sortKey: 'auth_type' },
    { label: 'Auth Type', value: 'auth_type desc', directionLabel: 'Z-A', sortKey: 'auth_type' },
    { label: 'Access Type', value: 'access_type asc', directionLabel: 'A-Z', sortKey: 'access_type' },
    { label: 'Access Type', value: 'access_type desc', directionLabel: 'Z-A', sortKey: 'access_type' },
    { label: 'Sensitive Params', value: 'sensitiveTags asc', directionLabel: 'A-Z', sortKey: 'sensitiveTags' },
    { label: 'Sensitive Params', value: 'sensitiveTags desc', directionLabel: 'Z-A', sortKey: 'sensitiveTags' },
    { label: 'Tags', value: 'tags asc', directionLabel: 'A-Z', sortKey: 'tags' },
    { label: 'Tags', value: 'tags desc', directionLabel: 'Z-A', sortKey: 'tags' }

];

const iconFunc = (methodName) => {
    switch (methodName.toUpperCase()) {
        case "GET":
            return "<svg width='70' height='20' viewBox='0 0 70 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12.936 8.06C12.72 7.644 12.42 7.332 12.036 7.124C11.652 6.908 11.208 6.8 10.704 6.8C10.152 6.8 9.66 6.924 9.228 7.172C8.796 7.42 8.456 7.772 8.208 8.228C7.968 8.684 7.848 9.212 7.848 9.812C7.848 10.412 7.968 10.944 8.208 11.408C8.456 11.864 8.796 12.216 9.228 12.464C9.66 12.712 10.152 12.836 10.704 12.836C11.448 12.836 12.052 12.628 12.516 12.212C12.98 11.796 13.264 11.232 13.368 10.52H10.236V9.428H14.832V10.496C14.744 11.144 14.512 11.74 14.136 12.284C13.768 12.828 13.284 13.264 12.684 13.592C12.092 13.912 11.432 14.072 10.704 14.072C9.92 14.072 9.204 13.892 8.556 13.532C7.908 13.164 7.392 12.656 7.008 12.008C6.632 11.36 6.444 10.628 6.444 9.812C6.444 8.996 6.632 8.264 7.008 7.616C7.392 6.968 7.908 6.464 8.556 6.104C9.212 5.736 9.928 5.552 10.704 5.552C11.592 5.552 12.38 5.772 13.068 6.212C13.764 6.644 14.268 7.26 14.58 8.06H12.936ZM17.5493 6.764V9.212H20.4293V10.328H17.5493V12.884H20.7893V14H16.1813V5.648H20.7893V6.764H17.5493ZM27.8622 5.66V6.776H25.6422V14H24.2742V6.776H22.0422V5.66H27.8622Z' fill='rgb(0, 127, 49)'/></svg>"

        case "POST":
            return "<svg width='70' height='20' viewBox='0 0 70 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12.732 8.144C12.732 8.568 12.632 8.968 12.432 9.344C12.232 9.72 11.912 10.028 11.472 10.268C11.032 10.5 10.468 10.616 9.78 10.616H8.268V14H6.9V5.66H9.78C10.42 5.66 10.96 5.772 11.4 5.996C11.848 6.212 12.18 6.508 12.396 6.884C12.62 7.26 12.732 7.68 12.732 8.144ZM9.78 9.5C10.3 9.5 10.688 9.384 10.944 9.152C11.2 8.912 11.328 8.576 11.328 8.144C11.328 7.232 10.812 6.776 9.78 6.776H8.268V9.5H9.78ZM17.8407 14.084C17.0647 14.084 16.3487 13.904 15.6927 13.544C15.0447 13.176 14.5287 12.668 14.1447 12.02C13.7687 11.364 13.5807 10.628 13.5807 9.812C13.5807 8.996 13.7687 8.264 14.1447 7.616C14.5287 6.968 15.0447 6.464 15.6927 6.104C16.3487 5.736 17.0647 5.552 17.8407 5.552C18.6247 5.552 19.3407 5.736 19.9887 6.104C20.6447 6.464 21.1607 6.968 21.5367 7.616C21.9127 8.264 22.1007 8.996 22.1007 9.812C22.1007 10.628 21.9127 11.364 21.5367 12.02C21.1607 12.668 20.6447 13.176 19.9887 13.544C19.3407 13.904 18.6247 14.084 17.8407 14.084ZM17.8407 12.896C18.3927 12.896 18.8847 12.772 19.3167 12.524C19.7487 12.268 20.0847 11.908 20.3247 11.444C20.5727 10.972 20.6967 10.428 20.6967 9.812C20.6967 9.196 20.5727 8.656 20.3247 8.192C20.0847 7.728 19.7487 7.372 19.3167 7.124C18.8847 6.876 18.3927 6.752 17.8407 6.752C17.2887 6.752 16.7967 6.876 16.3647 7.124C15.9327 7.372 15.5927 7.728 15.3447 8.192C15.1047 8.656 14.9847 9.196 14.9847 9.812C14.9847 10.428 15.1047 10.972 15.3447 11.444C15.5927 11.908 15.9327 12.268 16.3647 12.524C16.7967 12.772 17.2887 12.896 17.8407 12.896ZM26.1949 14.084C25.6349 14.084 25.1309 13.988 24.6829 13.796C24.2349 13.596 23.8829 13.316 23.6269 12.956C23.3709 12.596 23.2429 12.176 23.2429 11.696H24.7069C24.7389 12.056 24.8789 12.352 25.1269 12.584C25.3829 12.816 25.7389 12.932 26.1949 12.932C26.6669 12.932 27.0349 12.82 27.2989 12.596C27.5629 12.364 27.6949 12.068 27.6949 11.708C27.6949 11.428 27.6109 11.2 27.4429 11.024C27.2829 10.848 27.0789 10.712 26.8309 10.616C26.5909 10.52 26.2549 10.416 25.8229 10.304C25.2789 10.16 24.8349 10.016 24.4909 9.872C24.1549 9.72 23.8669 9.488 23.6269 9.176C23.3869 8.864 23.2669 8.448 23.2669 7.928C23.2669 7.448 23.3869 7.028 23.6269 6.668C23.8669 6.308 24.2029 6.032 24.6349 5.84C25.0669 5.648 25.5669 5.552 26.1349 5.552C26.9429 5.552 27.6029 5.756 28.1149 6.164C28.6349 6.564 28.9229 7.116 28.9789 7.82H27.4669C27.4429 7.516 27.2989 7.256 27.0349 7.04C26.7709 6.824 26.4229 6.716 25.9909 6.716C25.5989 6.716 25.2789 6.816 25.0309 7.016C24.7829 7.216 24.6589 7.504 24.6589 7.88C24.6589 8.136 24.7349 8.348 24.8869 8.516C25.0469 8.676 25.2469 8.804 25.4869 8.9C25.7269 8.996 26.0549 9.1 26.4709 9.212C27.0229 9.364 27.4709 9.516 27.8149 9.668C28.1669 9.82 28.4629 10.056 28.7029 10.376C28.9509 10.688 29.0749 11.108 29.0749 11.636C29.0749 12.06 28.9589 12.46 28.7269 12.836C28.5029 13.212 28.1709 13.516 27.7309 13.748C27.2989 13.972 26.7869 14.084 26.1949 14.084ZM36.0771 5.66V6.776H33.8571V14H32.4891V6.776H30.2571V5.66H36.0771Z' fill='rgba(0, 83, 184, 1)'/></svg>"

        case "PUT":
            return "<svg width='70' height='20' viewBox='0 0 70 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12.732 8.144C12.732 8.568 12.632 8.968 12.432 9.344C12.232 9.72 11.912 10.028 11.472 10.268C11.032 10.5 10.468 10.616 9.78 10.616H8.268V14H6.9V5.66H9.78C10.42 5.66 10.96 5.772 11.4 5.996C11.848 6.212 12.18 6.508 12.396 6.884C12.62 7.26 12.732 7.68 12.732 8.144ZM9.78 9.5C10.3 9.5 10.688 9.384 10.944 9.152C11.2 8.912 11.328 8.576 11.328 8.144C11.328 7.232 10.812 6.776 9.78 6.776H8.268V9.5H9.78ZM15.3927 5.66V10.976C15.3927 11.608 15.5567 12.084 15.8847 12.404C16.2207 12.724 16.6847 12.884 17.2767 12.884C17.8767 12.884 18.3407 12.724 18.6687 12.404C19.0047 12.084 19.1727 11.608 19.1727 10.976V5.66H20.5407V10.952C20.5407 11.632 20.3927 12.208 20.0967 12.68C19.8007 13.152 19.4047 13.504 18.9087 13.736C18.4127 13.968 17.8647 14.084 17.2647 14.084C16.6647 14.084 16.1167 13.968 15.6207 13.736C15.1327 13.504 14.7447 13.152 14.4567 12.68C14.1687 12.208 14.0247 11.632 14.0247 10.952V5.66H15.3927ZM27.7099 5.66V6.776H25.4899V14H24.1219V6.776H21.8899V5.66H27.7099Z' fill='rgb(173, 122, 3)'/></svg>"

        case "PATCH":
            return "<svg width='70' height='20' viewBox='0 0 70 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12.732 8.144C12.732 8.568 12.632 8.968 12.432 9.344C12.232 9.72 11.912 10.028 11.472 10.268C11.032 10.5 10.468 10.616 9.78 10.616H8.268V14H6.9V5.66H9.78C10.42 5.66 10.96 5.772 11.4 5.996C11.848 6.212 12.18 6.508 12.396 6.884C12.62 7.26 12.732 7.68 12.732 8.144ZM9.78 9.5C10.3 9.5 10.688 9.384 10.944 9.152C11.2 8.912 11.328 8.576 11.328 8.144C11.328 7.232 10.812 6.776 9.78 6.776H8.268V9.5H9.78ZM19.0647 12.296H15.5727L14.9727 14H13.5447L16.5327 5.648H18.1167L21.1047 14H19.6647L19.0647 12.296ZM18.6807 11.18L17.3247 7.304L15.9567 11.18H18.6807ZM27.7919 5.66V6.776H25.5719V14H24.2039V6.776H21.9719V5.66H27.7919ZM28.7213 9.812C28.7213 8.996 28.9093 8.264 29.2853 7.616C29.6693 6.968 30.1853 6.464 30.8333 6.104C31.4893 5.736 32.2053 5.552 32.9813 5.552C33.8693 5.552 34.6573 5.772 35.3453 6.212C36.0413 6.644 36.5453 7.26 36.8573 8.06H35.2133C34.9973 7.62 34.6973 7.292 34.3133 7.076C33.9293 6.86 33.4853 6.752 32.9813 6.752C32.4293 6.752 31.9373 6.876 31.5053 7.124C31.0733 7.372 30.7333 7.728 30.4853 8.192C30.2453 8.656 30.1253 9.196 30.1253 9.812C30.1253 10.428 30.2453 10.968 30.4853 11.432C30.7333 11.896 31.0733 12.256 31.5053 12.512C31.9373 12.76 32.4293 12.884 32.9813 12.884C33.4853 12.884 33.9293 12.776 34.3133 12.56C34.6973 12.344 34.9973 12.016 35.2133 11.576H36.8573C36.5453 12.376 36.0413 12.992 35.3453 13.424C34.6573 13.856 33.8693 14.072 32.9813 14.072C32.1973 14.072 31.4813 13.892 30.8333 13.532C30.1853 13.164 29.6693 12.656 29.2853 12.008C28.9093 11.36 28.7213 10.628 28.7213 9.812ZM45.1186 5.66V14H43.7506V10.352H39.8266V14H38.4586V5.66H39.8266V9.236H43.7506V5.66H45.1186Z' fill='rgb(98, 52, 151)'/></svg>"


        case "DELETE":
            return "<svg width='70' height='20' viewBox='0 0 70 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9.624 5.66C10.512 5.66 11.288 5.832 11.952 6.176C12.624 6.512 13.14 7 13.5 7.64C13.868 8.272 14.052 9.012 14.052 9.86C14.052 10.708 13.868 11.444 13.5 12.068C13.14 12.692 12.624 13.172 11.952 13.508C11.288 13.836 10.512 14 9.624 14H6.9V5.66H9.624ZM9.624 12.884C10.6 12.884 11.348 12.62 11.868 12.092C12.388 11.564 12.648 10.82 12.648 9.86C12.648 8.892 12.388 8.136 11.868 7.592C11.348 7.048 10.6 6.776 9.624 6.776H8.268V12.884H9.624ZM16.7758 6.764V9.212H19.6558V10.328H16.7758V12.884H20.0158V14H15.4078V5.648H20.0158V6.764H16.7758ZM23.0688 12.896H25.8888V14H21.7008V5.66H23.0688V12.896ZM28.4008 6.764V9.212H31.2808V10.328H28.4008V12.884H31.6408V14H27.0328V5.648H31.6408V6.764H28.4008ZM38.7138 5.66V6.776H36.4938V14H35.1258V6.776H32.8938V5.66H38.7138ZM41.4672 6.764V9.212H44.3472V10.328H41.4672V12.884H44.7072V14H40.0992V5.648H44.7072V6.764H41.4672Z' fill='rgb(142, 26, 16)'/></svg>"

        case "OPTIONS":
            return "<svg width='70' height='20' viewBox='0 0 70 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M10.704 14.084C9.928 14.084 9.212 13.904 8.556 13.544C7.908 13.176 7.392 12.668 7.008 12.02C6.632 11.364 6.444 10.628 6.444 9.812C6.444 8.996 6.632 8.264 7.008 7.616C7.392 6.968 7.908 6.464 8.556 6.104C9.212 5.736 9.928 5.552 10.704 5.552C11.488 5.552 12.204 5.736 12.852 6.104C13.508 6.464 14.024 6.968 14.4 7.616C14.776 8.264 14.964 8.996 14.964 9.812C14.964 10.628 14.776 11.364 14.4 12.02C14.024 12.668 13.508 13.176 12.852 13.544C12.204 13.904 11.488 14.084 10.704 14.084ZM10.704 12.896C11.256 12.896 11.748 12.772 12.18 12.524C12.612 12.268 12.948 11.908 13.188 11.444C13.436 10.972 13.56 10.428 13.56 9.812C13.56 9.196 13.436 8.656 13.188 8.192C12.948 7.728 12.612 7.372 12.18 7.124C11.748 6.876 11.256 6.752 10.704 6.752C10.152 6.752 9.66 6.876 9.228 7.124C8.796 7.372 8.456 7.728 8.208 8.192C7.968 8.656 7.848 9.196 7.848 9.812C7.848 10.428 7.968 10.972 8.208 11.444C8.456 11.908 8.796 12.268 9.228 12.524C9.66 12.772 10.152 12.896 10.704 12.896ZM22.1422 8.144C22.1422 8.568 22.0422 8.968 21.8422 9.344C21.6422 9.72 21.3222 10.028 20.8822 10.268C20.4422 10.5 19.8782 10.616 19.1902 10.616H17.6782V14H16.3102V5.66H19.1902C19.8302 5.66 20.3702 5.772 20.8102 5.996C21.2582 6.212 21.5902 6.508 21.8062 6.884C22.0302 7.26 22.1422 7.68 22.1422 8.144ZM19.1902 9.5C19.7102 9.5 20.0982 9.384 20.3542 9.152C20.6102 8.912 20.7382 8.576 20.7382 8.144C20.7382 7.232 20.2222 6.776 19.1902 6.776H17.6782V9.5H19.1902ZM28.8349 5.66V6.776H26.6149V14H25.2469V6.776H23.0149V5.66H28.8349ZM31.5883 5.66V14H30.2203V5.66H31.5883ZM37.1884 14.084C36.4124 14.084 35.6964 13.904 35.0404 13.544C34.3924 13.176 33.8764 12.668 33.4924 12.02C33.1164 11.364 32.9284 10.628 32.9284 9.812C32.9284 8.996 33.1164 8.264 33.4924 7.616C33.8764 6.968 34.3924 6.464 35.0404 6.104C35.6964 5.736 36.4124 5.552 37.1884 5.552C37.9724 5.552 38.6884 5.736 39.3364 6.104C39.9924 6.464 40.5084 6.968 40.8844 7.616C41.2604 8.264 41.4484 8.996 41.4484 9.812C41.4484 10.628 41.2604 11.364 40.8844 12.02C40.5084 12.668 39.9924 13.176 39.3364 13.544C38.6884 13.904 37.9724 14.084 37.1884 14.084ZM37.1884 12.896C37.7404 12.896 38.2324 12.772 38.6644 12.524C39.0964 12.268 39.4324 11.908 39.6724 11.444C39.9204 10.972 40.0444 10.428 40.0444 9.812C40.0444 9.196 39.9204 8.656 39.6724 8.192C39.4324 7.728 39.0964 7.372 38.6644 7.124C38.2324 6.876 37.7404 6.752 37.1884 6.752C36.6364 6.752 36.1444 6.876 35.7124 7.124C35.2804 7.372 34.9404 7.728 34.6924 8.192C34.4524 8.656 34.3324 9.196 34.3324 9.812C34.3324 10.428 34.4524 10.972 34.6924 11.444C34.9404 11.908 35.2804 12.268 35.7124 12.524C36.1444 12.772 36.6364 12.896 37.1884 12.896ZM49.6465 14H48.2785L44.1625 7.772V14H42.7945V5.648H44.1625L48.2785 11.864V5.648H49.6465V14ZM54.191 14.084C53.631 14.084 53.127 13.988 52.679 13.796C52.231 13.596 51.879 13.316 51.623 12.956C51.367 12.596 51.239 12.176 51.239 11.696H52.703C52.735 12.056 52.875 12.352 53.123 12.584C53.379 12.816 53.735 12.932 54.191 12.932C54.663 12.932 55.031 12.82 55.295 12.596C55.559 12.364 55.691 12.068 55.691 11.708C55.691 11.428 55.607 11.2 55.439 11.024C55.279 10.848 55.075 10.712 54.827 10.616C54.587 10.52 54.251 10.416 53.819 10.304C53.275 10.16 52.831 10.016 52.487 9.872C52.151 9.72 51.863 9.488 51.623 9.176C51.383 8.864 51.263 8.448 51.263 7.928C51.263 7.448 51.383 7.028 51.623 6.668C51.863 6.308 52.199 6.032 52.631 5.84C53.063 5.648 53.563 5.552 54.131 5.552C54.939 5.552 55.599 5.756 56.111 6.164C56.631 6.564 56.919 7.116 56.975 7.82H55.463C55.439 7.516 55.295 7.256 55.031 7.04C54.767 6.824 54.419 6.716 53.987 6.716C53.595 6.716 53.275 6.816 53.027 7.016C52.779 7.216 52.655 7.504 52.655 7.88C52.655 8.136 52.731 8.348 52.883 8.516C53.043 8.676 53.243 8.804 53.483 8.9C53.723 8.996 54.051 9.1 54.467 9.212C55.019 9.364 55.467 9.516 55.811 9.668C56.163 9.82 56.459 10.056 56.699 10.376C56.947 10.688 57.071 11.108 57.071 11.636C57.071 12.06 56.955 12.46 56.723 12.836C56.499 13.212 56.167 13.516 55.727 13.748C55.295 13.972 54.783 14.084 54.191 14.084Z' fill='rgb(166, 20, 104)'/></svg>"

        case "HEAD":
            return "<svg width='70' height='20' viewBox='0 0 70 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M13.56 5.66V14H12.192V10.352H8.268V14H6.9V5.66H8.268V9.236H12.192V5.66H13.56ZM16.7289 6.764V9.212H19.6089V10.328H16.7289V12.884H19.9689V14H15.3609V5.648H19.9689V6.764H16.7289ZM26.6819 12.296H23.1899L22.5899 14H21.1619L24.1499 5.648H25.7339L28.7219 14H27.2819L26.6819 12.296ZM26.2979 11.18L24.9419 7.304L23.5739 11.18H26.2979ZM32.7451 5.66C33.6331 5.66 34.4091 5.832 35.0731 6.176C35.7451 6.512 36.2611 7 36.6211 7.64C36.9891 8.272 37.1731 9.012 37.1731 9.86C37.1731 10.708 36.9891 11.444 36.6211 12.068C36.2611 12.692 35.7451 13.172 35.0731 13.508C34.4091 13.836 33.6331 14 32.7451 14H30.0211V5.66H32.7451ZM32.7451 12.884C33.7211 12.884 34.4691 12.62 34.9891 12.092C35.5091 11.564 35.7691 10.82 35.7691 9.86C35.7691 8.892 35.5091 8.136 34.9891 7.592C34.4691 7.048 33.7211 6.776 32.7451 6.776H31.3891V12.884H32.7451Z' fill='rgb(0, 127, 49)'/></svg>"

        default:
            return "";
    }

}

function ApiEndpoints() {

    const params = useParams()
    const apiCollectionId = params.apiCollectionId

    const allCollections = Store(state => state.allCollections)
    const showDetails = ObserveStore(state => state.inventoryFlyout)
    const setShowDetails = ObserveStore(state => state.setInventoryFlyout)

    const [apiEndpoints, setApiEndpoints] = useState([])
    const [apiInfoList, setApiInfoList] = useState([])
    const [unusedEndpoints, setUnusedEndpoints] = useState([])

    const [endpointData, setEndpointData] = useState([])
    const [selectedTab, setSelectedTab] = useState("All")
    const [selected, setSelected] = useState(0)
    const [loading, setLoading] = useState(true)
    const [apiDetail, setApiDetail] = useState({})

    const setFilteredEndpoints = ObserveStore(state => state.setFilteredItems)

    async function fetchData() {
        setLoading(true)
        let apiCollectionData = await api.fetchAPICollection(apiCollectionId)
        let apiEndpointsInCollection = apiCollectionData.data.endpoints.map(x => { return { ...x._id, startTs: x.startTs, changesCount: x.changesCount, shadow: x.shadow ? x.shadow : false } })
        let apiInfoListInCollection = apiCollectionData.data.apiInfoList
        let unusedEndpointsInCollection = apiCollectionData.unusedEndpoints
        let sensitiveParamsResp = await api.loadSensitiveParameters(apiCollectionId)
        let sensitiveParams = sensitiveParamsResp.data.endpoints

        let sensitiveParamsMap = {}
        sensitiveParams.forEach(p => {
            let key = p.method + " " + p.url
            if (!sensitiveParamsMap[key]) sensitiveParamsMap[key] = new Set()

            if (!p.subType) {
                p.subType = { name: "CUSTOM" }
            }

            sensitiveParamsMap[key].add(p.subType)
        })

        apiEndpointsInCollection.forEach(apiEndpoint => {
            apiEndpoint.sensitive = sensitiveParamsMap[apiEndpoint.method + " " + apiEndpoint.url] || new Set()
        })

        let data = {}
        let allEndpoints = func.mergeApiInfoAndApiCollection(apiEndpointsInCollection, apiInfoListInCollection, null, iconFunc)
        data['All'] = allEndpoints
        data['Sensitive'] = allEndpoints.filter(x => x.sensitive && x.sensitive.size > 0)
        data['Unauthenticated'] = allEndpoints.filter(x => x.open)
        data['Undocumented'] = allEndpoints.filter(x => x.shadow)
        data['Deprecated'] = func.getDeprecatedEndpoints(apiInfoListInCollection, unusedEndpointsInCollection)
        setEndpointData(data)
        setSelectedTab("All")
        setSelected(0)

        setApiEndpoints(apiEndpointsInCollection)
        setApiInfoList(apiInfoListInCollection)
        setUnusedEndpoints(unusedEndpointsInCollection)

        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const resourceName = {
        singular: 'endpoint',
        plural: 'endpoints',
    };

    const getFilteredItems = (filteredItems) => {
        setFilteredEndpoints(filteredItems)
    }

    console.log(setFilteredEndpoints)

    const tabStrings = [
        'All',
        'Sensitive',
        'Unauthenticated',
        'Undocumented',
        'Deprecated'
    ]

    const tabs = tabStrings.map((item, index) => ({
        content: item,
        index,
        id: `${item}-${index}`,
    }));

    const onSelect = (selectedIndex) => {
        setSelectedTab(tabStrings[selectedIndex])
        setSelected(selectedIndex)
    }

    function handleRowClick(data) {
        const sameRow = func.deepComparison(apiDetail, data);
        if(!sameRow){
            setShowDetails(true)
        }else{
            setShowDetails(!showDetails)
        }
        setApiDetail((prev) => {
            if (sameRow) {
                return prev;
            }
            return { ...data }
        })
    }

    function handleRefresh() {
        fetchData()
        func.setToast(true, false, "Endpoints refreshed")
    }

    async function exportOpenApi() {
        let lastFetchedUrl = null;
        let lastFetchedMethod = null;
        for (let index = 0; index < 10; index++) {
            let result = await api.downloadOpenApiFile(apiCollectionId, lastFetchedUrl, lastFetchedMethod)
            let openApiString = result["openAPIString"]
            let blob = new Blob([openApiString], {
                type: "application/json",
            });
            const fileName = "open_api_" + func.getCollectionName(apiCollectionId) + ".json";
            saveAs(blob, fileName);

            lastFetchedUrl = result["lastFetchedUrl"]
            lastFetchedMethod = result["lastFetchedMethod"]

            if (!lastFetchedUrl || !lastFetchedMethod) break;
        }
        func.setToast(true, false, "OpenAPI spec downlaoded successfully")
    }

    function exportCsv() {
        if (!loading) {
            let headerTextToValueMap = Object.fromEntries(headers.map(x => [x.text, x.value]).filter(x => x[0].length > 0));

            let csv = Object.keys(headerTextToValueMap).join(",") + "\r\n"
            const allEndpoints = endpointData['All']
            allEndpoints.forEach(i => {
                csv += Object.values(headerTextToValueMap).map(h => (i[h] || "-")).join(",") + "\r\n"
            })
            let blob = new Blob([csv], {
                type: "application/csvcharset=UTF-8"
            });
            saveAs(blob, ("All endopints") + ".csv");
            func.setToast(true, false, "CSV exported successfully")
        }
    }

    async function exportPostman() {
        const result = await api.exportToPostman(apiCollectionId)
        if (result) 
            func.setToast(true, false, "Postman collection downloaded successfully")
    }

    function handleFileChange(file) {
        if (file) {
            const reader = new FileReader();
            
            let isHar = file.name.endsWith(".har")
            if(isHar && file.size >= 52428800){
                func.setToast(true, true, "Please limit the file size to less than 50 MB")
                return
            }
            let isJson = file.name.endsWith(".json")
            let isPcap = file.name.endsWith(".pcap")
            if (isHar || isJson) {
                reader.readAsText(file)
            } else if (isPcap) {
                reader.readAsArrayBuffer(new Blob([file]))
            }
            reader.onload = async () => {
                let skipKafka = false;//window.location.href.indexOf("http://localhost") != -1
                if (isHar) {
                    const formData = new FormData();
                    formData.append("harString", reader.result)
                    formData.append("hsFile", reader.result)
                    formData.append("skipKafka", skipKafka)
                    formData.append("apiCollectionId", apiCollectionId);
                    func.setToast(true, false, "We are uploading your har file, please dont refresh the page!")

                    api.uploadHarFile(formData).then(resp => {
                        if(file.size > 2097152){
                            func.setToast(true, false, "We have successfully read your file")
                        }
                        else {
                            func.setToast(true, false, "Your Har file has been successfully processed")
                        }
                        fetchData()
                    }).catch(err => {
                        if(err.message.includes(404)){
                            func.setToast(true, true, "Please limit the file size to less than 50 MB")
                        } else {
                            func.setToast(true, true, "Something went wrong while processing the file")
                        }
                    })

                } else if (isPcap) {
                    var arrayBuffer = reader.result
                    var bytes = new Uint8Array(arrayBuffer);

                    await api.uploadTcpFile([...bytes], apiCollectionId, skipKafka)
                } 
            }
        }
    }

    return (
        <PageWithMultipleCards
            title={
                <Text variant='headingLg' truncate>
                    {
                        "API Endpoints"
                    }
                </Text>
            }
            // primaryAction={
            //     <RunTest />
            // }
            secondaryActions={
                <ButtonGroup>
                    <Tooltip content="Refresh">
                        <Button icon={RedoMajor} onClick={handleRefresh} plain helpText="Refresh" />
                    </Tooltip>
                    <Button
                        icon={ImportMinor}
                        connectedDisclosure={{
                            actions: [
                                { content: 'OpenAPI spec', onAction: exportOpenApi },
                                { content: 'Postman', onAction: exportPostman },
                                { content: 'CSV', onAction: exportCsv },
                            ],
                        }}
                    >
                        Export
                    </Button>
                    <UploadFile 
                        fileFormat=".har"
                        fileChanged={file => handleFileChange(file)} 
                        tooltipText="Upload traffic(.har)" 
                        label="Upload traffic"
                        primary={false}/>
                    <RunTest />
                </ButtonGroup>
            }
            components={[
                <div className="apiEndpointsTable" key="table">
                    <GithubSimpleTable
                        key="table"
                        pageLimit={50}
                        data={loading ? [] : endpointData[selectedTab]}
                        sortOptions={sortOptions}
                        resourceName={resourceName}
                        filters={[]}
                        disambiguateLabel={() => { }}
                        headers={headers}
                        getStatus={() => { return "warning" }}
                        tabs={tabs}
                        selected={selected}
                        onSelect={onSelect}
                        onRowClick={handleRowClick}
                        getFilteredItems={getFilteredItems}
                    />
                </div>,
                <ApiDetails
                    key="details"
                    showDetails={showDetails}
                    setShowDetails={setShowDetails}
                    apiDetail={apiDetail}
                    headers={headers}
                    getStatus={() => { return "warning" }}
                />
            ]}
        />
    )
}

export default ApiEndpoints
