from pydantic import BaseModel
from typing import List, Literal


class NetworkAndFacility(BaseModel):
    network_id: str
    facility_id: str

    class Config:
        schema_extra = {
            "example": {
                "network_id": "4d5c30a7-0708-446e-a72e-765f2bc92a46",
                "facility_id": "ElEstero"
            }
        }


class PreprocessingInterface(NetworkAndFacility):
    default_run: bool
    variable_name: str
    parameters: list

    # Note: "SCADA_tag" is excluded from parameters
    class Config:
        schema_extra = {
            "example": """{
                "network_id": "4d5c30a7-0708-446e-a72e-765f2bc92a46",
                "facility_id": "ElEstero",
                "default_run": true,
                "variable_name": "",
                "parameters": {
                    "neg_tol": 1e-9,
                    "zero_tol": 1e-9,
                    "detotalize": false,
                    "to_numeric": true,
                    "source_path": "",
                    "remove_0_values": false,
                    "id_adj_values_tol": 1e-9,
                    "remove_neg_values": false,
                    "remove_id_adj_values": false,
                    "detotalize_validation": {
                        "impute": false,
                        "neg_tol": 1e-9,
                        "use_nans": false,
                        "zero_tol": 1e-9,
                        "use_zeros": false,
                        "use_negatives": false
                    },
                    "custom_preprocess_function": {
                        "args": [],
                        "kwargs": {},
                        "method": ""
                    }
                }
            }"""
        }


class CleaningInterface(NetworkAndFacility):
    default_run: bool
    variable_name: str
    parameters: list

    class Config:
        schema_extra = {
            "example": """{
                "network_id": "4d5c30a7-0708-446e-a72e-765f2bc92a46",
                "facility_id": "ElEstero",
                "default_run": true,
                "variable_name": "",
                "parameters": {
                    "clean_tukey": true,
                    "outlier_cutoff": [],
                    "custom_clean_bool": [],
                    "outlier_chg_cutoff": [],
                    "custom_clean_function": {
                      "args": [],
                      "kwargs": {},
                      "method": ""
                    }
                }
            }"""
        }


class ImputationInterface(NetworkAndFacility):
    default_run: bool
    variable_name: str
    parameters: dict

    class Config:
        schema_extra = {
            "example": """{
                "network_id": "4d5c30a7-0708-446e-a72e-765f2bc92a46",
                "facility_id": "ElEstero",
                "default_run": true,
                "variable_name": "all",
                "parameters": {
                    "method": "regls",
                    "model_structure": {
                        "variables": {
                            "variable": {
                                "nlags": 1,
                                "ma_window": 0
                            },
                            "hour": {
                                "nlags": 0,
                                "ma_window": 0
                            },
                            "weekday": {
                                "nlags": 0,
                                "ma_window": 0
                            },
                            "quarter": {
                                "nlags": 0,
                                "ma_window": 0
                            }
                        },
                        "interaction_terms": []
                    },
                    "model_trainer_args": [],
                    "model_trainer_kwargs": {
                        "fit_intercept": false,
                        "add_time_vars": true
                    },
                    "allocate_balance_to_children": false,
                    "allocate_balance_to": ""
                }
            }"""
        }


class FinalizationInterface(NetworkAndFacility):
    parameters: dict

    class Config:
        schema_extra = {
            "example": """{
                "network_id": "4d5c30a7-0708-446e-a72e-765f2bc92a46",
                "facility_id": "ElEstero",
                "parameters": {
                    "merge_type": [],
                    "custom_clean_function": []
                }
            }"""
        }


class TrainingInterface(NetworkAndFacility):
    parameters: dict

    class Config:
        schema_extra = {
            "example": """{
                "network_id": "4d5c30a7-0708-446e-a72e-765f2bc92a46",
                "facility_id": "ElEstero",
                "parameters": {
                    "Conditioner_Biogas_OutFlow": {
                        "variables": {
                            "Conditioner_Biogas_OutFlow": {
                                "ma_window": 0,
                                "nlags": 1
                            },
                            "FOGTank_FOGPump_FatOilGrease_Flow": {
                                "ma_window": 0,
                                "nlags": 6,
                                "given": true
                            },
                            "DAFTPump_AnaerobicDigester_ThickenedSludgeBlend_Flow": {
                                "ma_window": 96,
                                "nlags": 0
                            },
                            "GTPump_AnaerobicDigester_TPS_Flow": {
                                "ma_window": 96,
                                "nlags": 0,
                                "given": true
                            }
                        },
                        "interaction_terms": [],
                        "fit_intercept": false,
                        "method": "self.get_regls_predictions"
                    },
                    "VirtualDemand_Electricity_InFlow": {
                        "variables": {
                            "VirtualDemand_Electricity_InFlow": {
                                "ma_window": 0,
                                "nlags": 1
                            },
                            "SewerNetwork_ElEstero_BarScreen_UntreatedSewage_Flow": {
                                "ma_window": 0,
                                "nlags": 6
                            }
                        },
                        "interaction_terms": [],
                        "fit_intercept": true,
                        "method": "self.get_regls_predictions"
                    }
                }
            }"""
        }


class SimulationInterface(NetworkAndFacility):
    baseline_network_id: str
    billing_data_name: str
    parameters: dict

    class Config:
        schema_extra = {
            "example": """{
                "network_id": "4d5c30a7-0708-446e-a72e-765f2bc92a46",
                "baseline_network_id": "None",
                "facility_id": "ElEstero",
                "billing_data_name": "004 __ billing_data.csv",
                "parameters": {
                    "discount rate": 0.02,
                    "horizon days": 8.0,
                    "optimization overlap days": 1.0,
                    "minimum electricity demand": 0.0,
                    "natural gas blend limit": "baseline",
                    "objective function": {
                      "energy scale factor lambda": 2.72,
                      "minimum net demand penalty": 100
                    },
                    "gross demand adjustments": [],
                    "forecast error sd (kW)": 27,
                    "forecast error seed": 1.0,
                    "low flaring quantile limit": 0.974,
                    "low generation capacity factor limit": 0.1,
                    "reliable cogen": false
                }
            }"""
        }


class UserCreationResponse(BaseModel):
    status: str
    user_id: str

    class Config:
        schema_extra = {
            "example": {
                "status": "success",
                "user_id": "3b5d05ff-5e91-4b9b-a121-70712fff9baf"
            }
        }


class FileUploadResponse(BaseModel):
    file_id: str
    file_name: str
    data_type: str
    s3_key: str

    class Config:
        schema_extra = {
            "example": {
                "file_id": "4d51ef38-1258-43f9-a884-2fc0fbe565ab",
                "file_name": "billing_data.csv",
                "data_type": "billing_data",
                "s3_key": "user_3a4fefd3-0c0f-4bc5-a2e5-12c1b4a9c281/billing_data/billing_data.csv",
            }
        }


UTILITY_TYPES = Literal["gas", "electric"]
RATE_TYPE = Literal["customer", "demand", "energy"]
ASSESSMENT_PERIOD = Literal["daily", "monthly", "quarterly", "annual"]


class RateSchedule(BaseModel):
    utility: UTILITY_TYPES
    type: RATE_TYPE
    name: str
    assessed: ASSESSMENT_PERIOD | None
    basic_charge_limit: float | None
    month_start: int | None
    month_end: int | None
    hour_start: int | None
    hour_end: int | None
    weekday_start: int | None
    weekday_end: int | None
    charge: float
    units: str

    class Config:
        schema_extra = {
            "example": {
                "utility": "electric",
                "type": "customer",
                "name": "peak-summer",
                "assessed": "monthly",
                "basic_charge_limit": 0.0,
                "month_start": 0,
                "month_end": 6,
                "hour_start": 9,
                "hour_end": 16,
                "weekday_start": 6,
                "weekday_end": 6,
                "charge": 4.7,
                "units": "$/kW",
            }
        }


class BillingData(BaseModel):
    billing_data_name: str
    items: List[RateSchedule]

    class Config:
        schema_extra = {
            "example": {
                "billing_data_name": "billing_data_sample",
                "items":
                    [
                        {
                            'utility': 'electric',
                            'type': 'customer',
                            'name': "charge_customer",
                            'assessed': None,
                            'basic_charge_limit': None,
                            'month_start': None,
                            'month_end': None,
                            'hour_start': None,
                            'hour_end': None,
                            'weekday_start': None,
                            'weekday_end': None,
                            'charge': 357.97,
                            'units': '$/month',
                        },
                        {
                            'utility': 'electric',
                            'type': 'demand',
                            'name': 'peak-summer',
                            'assessed': 'monthly',
                            'basic_charge_limit': 0.0,
                            'month_start': 6,
                            'month_end': 9,
                            'hour_start': 16,
                            'hour_end': 21,
                            'weekday_start': 0,
                            'weekday_end': 4,
                            'charge': 14.18,
                            'units': '$/kW',
                        },
                        {
                            'utility': 'electric',
                            'type': 'energy',
                            'name': "charge_energy",
                            'basic_charge_limit': 0.0,
                            'month_start': 6,
                            'month_end': 9,
                            'hour_start': 16,
                            'hour_end': 21,
                            'weekday_start': 0,
                            'weekday_end': 4,
                            'charge': 0.03373,
                            'units': '$/kW',
                        }
                    ]
            }
        }


class AnalyticsCost(BaseModel):
    network_id: str
    facility_id: str
    rate_schedule_id: str
    start_dates: List[str]

    class Config:
        schema_extra = {
            "example": {
                "network_id": "b6535968-c1b0-45bc-a88e-d9c6a6e4a7ea",
                "facility_id": "ElEstero",
                "rate_schedule_id": "7d9760e0-969e-448c-b3e9-f06dda692d01",
                "start_dates": ['2021-02-01', '2019-11-01', '2020-07-01', '2021-12-01', '2020-12-01']
            }
        }