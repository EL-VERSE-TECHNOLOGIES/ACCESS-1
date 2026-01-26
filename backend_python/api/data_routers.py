from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from config.database import get_db
from models.schemas import User
from utils.auth import get_current_user_from_token
from datetime import datetime
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import json

router = APIRouter()


@router.post("/process-data")
async def process_data(payload: Dict[str, Any], token: str = None, db: Session = Depends(get_db)):
    """
    Process incoming data using Python's data processing capabilities
    """
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    # Example data processing - in real implementation, this would be more sophisticated
    try:
        # Simulate data processing
        data = payload.get("data", [])
        processed_data = []
        
        for item in data:
            # Example processing: normalize values, add computed fields
            if isinstance(item, dict):
                processed_item = item.copy()
                # Add a processed timestamp
                processed_item["processed_at"] = datetime.utcnow().isoformat()
                processed_data.append(processed_item)
        
        return {
            "status": "success",
            "processed_count": len(processed_data),
            "data": processed_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing data: {str(e)}"
        )


@router.post("/analyze")
async def analyze_data(payload: Dict[str, Any], token: str = None, db: Session = Depends(get_db)):
    """
    Perform data analysis using Python's analytical libraries
    """
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    try:
        # Example analysis - in real implementation, this would be more sophisticated
        data = payload.get("data", [])
        
        if not data:
            return {
                "status": "success",
                "analysis": {
                    "total_records": 0,
                    "summary": "No data provided for analysis"
                }
            }
        
        # Convert to DataFrame for analysis
        df = pd.DataFrame(data)
        
        # Perform basic statistical analysis
        numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_columns = df.select_dtypes(exclude=[np.number]).columns.tolist()
        
        analysis_result = {
            "total_records": len(df),
            "numeric_summary": df[numeric_columns].describe().to_dict() if numeric_columns else {},
            "categorical_summary": {
                col: df[col].value_counts().to_dict() for col in categorical_columns
            } if categorical_columns else {},
            "correlations": df[numeric_columns].corr().to_dict() if len(numeric_columns) > 1 else {},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return {
            "status": "success",
            "analysis": analysis_result
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error performing analysis: {str(e)}"
        )


@router.post("/predict")
async def predict_data(payload: Dict[str, Any], token: str = None, db: Session = Depends(get_db)):
    """
    Perform predictive analysis using ML models
    """
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    try:
        # Example prediction - in real implementation, this would use trained models
        features = payload.get("features", [])
        target_column = payload.get("target_column", "")
        
        if not features or not target_column:
            raise HTTPException(
                status_code=400,
                detail="Features and target_column are required for prediction"
            )
        
        # Convert to DataFrame
        df = pd.DataFrame(features)
        
        if target_column not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Target column '{target_column}' not found in data"
            )
        
        # Prepare features and target
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Ensure all feature columns are numeric
        numeric_cols = X.select_dtypes(include=[np.number]).columns
        X_numeric = X[numeric_cols]
        
        if X_numeric.empty:
            raise HTTPException(
                status_code=400,
                detail="No numeric features found for prediction"
            )
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X_numeric, y, test_size=0.2, random_state=42)
        
        # Train model
        model = LinearRegression()
        model.fit(X_train, y_train)
        
        # Make predictions
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        
        # Predict on full dataset
        full_predictions = model.predict(X_numeric)
        
        return {
            "status": "success",
            "model_metrics": {
                "mean_squared_error": mse,
                "sample_size": len(y_test)
            },
            "predictions": full_predictions.tolist(),
            "feature_importance": dict(zip(X_numeric.columns, model.coef_.tolist()))
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error performing prediction: {str(e)}"
        )


@router.get("/analytics/leaderboard-insights")
async def get_leaderboard_insights(token: str = None, db: Session = Depends(get_db)):
    """
    Get advanced analytics insights for leaderboards
    """
    user = get_current_user_from_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    # In a real implementation, this would query the database for user performance data
    # and perform advanced analytics
    
    insights = {
        "top_performers_trends": [
            {"week": "Week 1", "avg_score": 85.5},
            {"week": "Week 2", "avg_score": 87.2},
            {"week": "Week 3", "avg_score": 89.1},
            {"week": "Week 4", "avg_score": 91.3}
        ],
        "skill_growth_patterns": {
            "most_improved_skills": ["React", "Python", "System Design"],
            "average_improvement_rate": 15.3
        },
        "engagement_metrics": {
            "active_users_this_week": 124,
            "avg_session_duration": 45.2,
            "task_completion_rate": 78.5
        },
        "timestamp": datetime.utcnow().isoformat()
    }
    
    return {
        "status": "success",
        "insights": insights
    }


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "python-data-analytics"}