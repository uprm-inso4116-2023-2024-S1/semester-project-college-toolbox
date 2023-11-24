const FormFactory = ({
	formConfig,
	formData,
	handleInputChange,
	handleAdd,
	handleCancel,
	submitLabel,
	cancelLabel,
}) => {
	return (
		<div className="form-section">
			{formConfig.map((field) => (
				<div key={field.name}>
					<label>{field.label}:</label>
					{field.type === 'select' ? (
						<select
							name={field.name}
							value={formData[field.name]}
							onChange={handleInputChange}
							className="input-field"
						>
							{field.options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					) : field.type === 'file' ? (
						<input
							type="file"
							accept={field.accept}
							name={field.name}
							onChange={handleInputChange}
							className="input-field"
						/>
					) : (
						<input
							type={field.type}
							name={field.name}
							value={formData[field.name]}
							onChange={handleInputChange}
							className="input-field"
						/>
					)}
				</div>
			))}
			<button onClick={handleAdd} className="add-button">
				{submitLabel}
			</button>
			<button onClick={handleCancel}>{cancelLabel}</button>
		</div>
	);
};

export default FormFactory;
