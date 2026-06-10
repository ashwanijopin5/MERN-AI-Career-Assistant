import os
import sys
import pickle
import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import (
    train_test_split,
    cross_val_score,
    RandomizedSearchCV,
)
from sklearn.metrics import mean_absolute_error, r2_score
from train.training_data import get_training_data

models = {
    "RandomForest": RandomForestRegressor(random_state=42, n_jobs=-1),
    "GradientBoosting": GradientBoostingRegressor(random_state=42),
}

hyperparameters = {
    "RandomForest": {
        "n_estimators": [100, 200, 300, 500],
        "max_depth": [4, 6, 8, 10, None],
        "min_samples_split": [2, 5, 10],
        "min_samples_leaf": [1, 2, 4],
        "max_features": ["sqrt", "log2", None],
    },
    "GradientBoosting": {
        "n_estimators": [100, 200, 300],
        "max_depth": [3, 4, 5, 6],
        "learning_rate": [0.01, 0.05, 0.1, 0.2],
        "subsample": [0.6, 0.8, 1.0],
        "min_samples_split": [2, 5, 10],
    },
}


def model_selection(X, y):
    results = []

    for model_name, model in models.items():
        print(f"\n  Tuning {model_name}...")
        params = hyperparameters[model_name]

        search = RandomizedSearchCV(
            model,
            params,
            n_iter=20,
            cv=5,
            scoring="neg_mean_absolute_error",
            random_state=42,
            n_jobs=-1,
            verbose=0,
        )
        search.fit(X, y)

        best_mae = -search.best_score_
        print(f"  Best CV MAE  : {best_mae:.2f}")
        print(f"  Best params  : {search.best_params_}")

        results.append(
            {
                "model_name": model_name,
                "best_model": search.best_estimator_,
                "best_params": search.best_params_,
                "best_cv_mae": best_mae,
            }
        )

    results_df = pd.DataFrame(
        results, columns=["model_name", "best_model", "best_params", "best_cv_mae"]
    )

    return results_df


def train_and_save(num_samples=2000):

    df = get_training_data(num_samples)
    print(df.describe())
    print("Shape:", df.shape)
    print(f"Score range: {df.score.min()} - {df.score.max()}")
    print(f"Mean score : {df.score.mean():.1f}")
    print(df["score"].describe())
    X = df.drop(columns=["score"])
    y = df["score"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Train: {len(X_train)} | Test: {len(X_test)}")

    print("\nRunning RandomizedSearchCV for all models...")
    results_df = model_selection(X_train, y_train)

    print("\nModel Selection Results:")
    print(results_df[["model_name", "best_cv_mae", "best_params"]].to_string())

    best_row = results_df.loc[results_df["best_cv_mae"].idxmin()]
    best_model = best_row["best_model"]
    best_name = best_row["model_name"]

    print(f"\nBest model selected: {best_name}")

    y_pred = best_model.predict(X_test)
    test_mae = mean_absolute_error(y_test, y_pred)
    test_r2 = r2_score(y_test, y_pred)
    train_r2 = best_model.score(X_train, y_train)

    print(f"Train R2 : {train_r2:.3f}")
    print(f"Test MAE : {test_mae:.2f}")
    print(f"Test R2  : {test_r2:.3f}")

    if train_r2 - test_r2 > 0.1:
        print("Warning: possible overfitting — train R2 much higher than test R2")
    else:
        print("Good: no significant overfitting detected")

    cv_scores = cross_val_score(
        best_model, X_train, y_train, cv=5, scoring="neg_mean_absolute_error", n_jobs=-1
    )

    cv_mae = -cv_scores.mean()
    cv_std = cv_scores.std()
    print(f"CV MAE: {cv_mae:.2f} ± {cv_std:.2f}")

    feature_columns = X.columns.tolist()

    importances = best_model.feature_importances_
    importance_pairs = sorted(
        zip(feature_columns, importances), key=lambda x: x[1], reverse=True
    )
    print("\nFeature importance (top 10):")
    for feature, importance in importance_pairs[:10]:
        bar = "█" * int(importance * 100)
        print(f"  {feature:<25} {bar} {importance:.3f}")

    
    model_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models"
    )
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "resume_scorer.pkl")

    model_data = {
        "model": best_model,
        "model_name": best_name,
        "feature_columns": feature_columns,
        "mae": test_mae,
        "r2": test_r2,
        "best_params": best_row["best_params"],
        "cv_mae": cv_mae,
        'train_r2': train_r2,
        'cv_std': cv_std,
        "num_samples": num_samples,
        "feature_importance": {
            feature: float(score) for feature, score in importance_pairs
        },
    }
    for k, v in list(model_data["feature_importance"].items())[:5]:
        print(k, v)
    with open(model_path, "wb") as f:
        pickle.dump(model_data, f)
        

    print(f"\nModel saved → {model_path}")
    print(f"Model : {best_name} | MAE: {test_mae:.2f} | R2: {test_r2:.3f}")

    return best_model


if __name__ == "__main__":
    train_and_save()
