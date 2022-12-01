CREATE TABLE import_test.products (
	product_id INT auto_increment NOT NULL,
    amount BIGINT UNSIGNED DEFAULT 0 NOT NULL,
    product_nm varchar(100) NOT NULL,
	CONSTRAINT Products_PK PRIMARY KEY (product_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE import_test.payments (
	payment_id INT auto_increment NOT NULL,
    product_id INT NOT NULL,
    merchant_uid varchar(128) NOT NULL,
	imp_uid varchar(128) NULL,
	amount BIGINT UNSIGNED DEFAULT 0 NOT NULL,
	cancel_amount BIGINT UNSIGNED NULL,
    currency varchar(10) NULL,
	`status` varchar(10) DEFAULT "ready" NOT NULL,
    is_valid BOOL DEFAULT 0 NOT NULL,
    pay_method varchar(20) NULL,
    channel varchar(20) NULL,
    pg_provider varchar(20) NULL,
    emb_pg_provider varchar(20) NULL,
    pg_tid varchar(512) NULL,
    pg_id varchar(512) NULL,
    escrow BOOL NULL,
    apply_num varchar(512) NULL,
    bank_code varchar(512) NULL,
    bank_name varchar(512) NULL,
    card_code varchar(512) NULL,
    card_name varchar(512) NULL,
    card_quota varchar(512) NULL,
    card_number varchar(512) NULL,
    card_type varchar(1) NULL,
    vbank_code varchar(512) NULL,
    vbank_name varchar(512) NULL,
    vbank_num varchar(512) NULL,
    vbank_holder varchar(512) NULL,
    vbank_date DATETIME NULL,
    vbank_issued_at DATETIME NULL,
    buyer_name varchar(100) NULL,
    buyer_email varchar(128) NULL,
    buyer_tel varchar(128) NULL,
    buyer_addr varchar(128) NULL,
    buyer_postcode varchar(128) NULL,
    custom_data varchar(512) NULL,
    started_at DATETIME NULL,
    paid_at DATETIME NULL,
    failed_at DATETIME NULL,
    cancelled_at DATETIME NULL,
    fail_reason varchar(512) NULL,
    cancel_reason varchar(512) NULL,
    cancel_receipt_urls varchar(512) NULL,
    receipt_url varchar(512) NULL,
    cancel_history varchar(512) NULL,
    cash_receipt_issued BOOL NULL,
    customer_uid varchar(512) NULL,
    customer_uid_usage varchar(50) NULL,
	CONSTRAINT Payments_PK PRIMARY KEY (payment_id),
    CONSTRAINT Payments_FK FOREIGN KEY (product_id) REFERENCES import_test.products(product_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE import_test.users (
	`user_id` INT auto_increment NOT NULL,
    username varchar(100) NOT NULL,
    `password` varchar(512) NOT NULL,
    `name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `tel` varchar(100) NOT NULL,
    `addr` varchar(100) NOT NULL,
    `postcode` varchar(100) NOT NULL,
    vbank_name varchar(512) NULL,
    vbank_num varchar(512) NULL,
    vbank_date DATETIME NULL, 
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NOT NULL,
    update_at TIMESTAMP NULL,
    delete_at TIMESTAMP NULL,
	CONSTRAINT Users_PK PRIMARY KEY (`user_id`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;