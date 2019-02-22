package run_base_pkg is
  signal runner : runner_sync_t := (phase => test_runner_entry,
                                    locks => ((false, false),
                                              (false, false),
                                              (false, false)),
                                    exit_without_errors => false,
                                    exit_simulation => false);

  shared variable runner_trace_logger : logger_t;

  procedure runner_init;

  impure function get_phase
      return runner_phase_t;

  procedure set_test_case_name (
    constant index : in positive;
    constant new_name  : in string);

  impure function get_test_case_name (
    constant index : positive)
    return string;

  procedure set_num_of_test_cases (
    constant new_value : in integer);
end package;