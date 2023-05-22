const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ChildTypes = require('../../models/category/ChildType');
const ParentTypes = require('../../models/category/ParentType');
const BookingDetail = require('../../models/booking/BookingDetail');
const BookingHistories = require('../../models/booking/BookingHistory');
const BookingChildTypes = require('../../models/booking/BookingChildType');
const BookingOtherServices = require('../../models/booking/BookingOtherService');

const Booking = sequelize.define(
    'booking',
    {
        booking_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        customer_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
		status: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
		payment_status: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        service_category_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        province_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        building_floor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        gate: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        parent_type_id: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        have_pets: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        ironing_clothes: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        ironing_clothes_fee: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        favorite_worker: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        premium: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        days: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        start_day: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        package: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        promotion_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        payment_method_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        tip: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        working_time: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: true,
        },
        total_time: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: true,
        },
        worker_earnings: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        service_fee: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        total: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        long: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        priority: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        priority_worker: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        end_day: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        time_key: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
		time_key_detail: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_test: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        app_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        booking_id_crm: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        payment_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        show_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        amount_worker: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 1,
        },
        district: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_flag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        contract_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        own_tools: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        foreign_language: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        product_code_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        extra_service_fee_details: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        min_recomendation_max: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        origin_total_payment: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        handwash: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        commission_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        commission: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        commission_show: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        booking_changing: {
            type: DataTypes.TEXT,
        },
        booking_language: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        commission: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        admin_fee: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        // Used for: mark to distinguish booking without payment and error payment
        show_on_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
		creator_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		shift_detail_fee: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
		payment_bills: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
		current_job: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
		note_service: {
			type: DataTypes.TEXT,
            allowNull: true,
		},
		detail_service: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		list_images: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		visit_charges: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
		}
    },
    {
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
);

// Booking (1 -> 1) Booking Detail
Booking.hasMany(BookingDetail, {
    as: 'booking_detail',
    foreignKey: 'booking_id',
});

BookingDetail.belongsTo(Booking, {
    as: 'booking',
    foreignKey: 'booking_id',
});

// // Booking Detail (1 -> n) Booking History
// Booking.hasMany(BookingHistories, {
//     as: 'booking_to_history',
//     foreignKey: 'booking_id',
// });

// BookingHistories.belongsTo(Booking, {
//     as: 'history_to_booking',
//     foreignKey: 'booking_id',
// });

// // Booking (n -> n) Child Type => through: Booking Child Type
// Booking.belongsToMany(ChildTypes, {
//     as: 'booking_child_types',
//     through: BookingChildTypes,
//     foreignKey: 'booking_id',
//     otherkey: 'child_type_id',
// });

// ChildTypes.belongsToMany(Booking, {
//     as: 'child_type_bookings',
//     through: BookingChildTypes,
//     foreignKey: 'child_type_id',
//     otherkey: 'booking_id',
// });

// // Booking (1 -> n) Booking Child Type
// Booking.hasMany(BookingChildTypes, {
//     as: 'booking_booking_child_types',
//     foreignKey: 'booking_id',
// });

// BookingChildTypes.belongsTo(Booking, {
//     as: 'booking_child_type_booking',
//     foreignKey: 'booking_id',
// });

// // Child Type (1 -> n) Booking Child Type
// ChildTypes.hasMany(BookingChildTypes, {
//     as: 'booking_booking_child_types',
//     foreignKey: 'child_type_id',
// });

// BookingChildTypes.belongsTo(ChildTypes, {
//     as: 'booking_child_type_child_type',
//     foreignKey: 'child_type_id',
// });

module.exports = Booking;
