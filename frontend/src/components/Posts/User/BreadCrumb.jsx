import React from "react";
import { Link, useLocation } from "react-router-dom";

const BreadCrumb = ({ customNames = {} }) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
                <li className="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <Link to="/" itemprop="item">
                        <span itemprop="name">Trang chủ</span>
                    </Link>
                    <meta itemprop="position" content="1" />
                </li>
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathnames.length - 1;
                    const displayName = customNames[name] || decodeURIComponent(name);

                    return (
                        <li
                            className={`breadcrumb-item${isLast ? " active" : ""}`}
                            key={index}
                            itemprop="itemListElement"
                            itemscope
                            itemtype="https://schema.org/ListItem"
                            aria-current={isLast ? "page" : undefined}
                        >
                            {isLast ? (
                                <span itemprop="name">{displayName}</span>
                            ) : (
                                <Link to={routeTo} itemprop="item">
                                    <span itemprop="name">{displayName}</span>
                                </Link>
                            )}
                            <meta itemprop="position" content={index + 2} />
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default BreadCrumb;
